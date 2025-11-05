import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...');

    // Read the schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        // Use raw SQL execution for DDL statements
        const { error } = await supabaseAdmin.rpc('exec_sql', {
          sql_query: statement
        });

        if (error) {
          // Try alternative method for statements that might not work with rpc
          console.log(`⚠️  RPC failed, trying direct execution: ${error.message}`);
          
          // For some statements, we might need to handle them differently
          if (statement.includes('CREATE TYPE') || 
              statement.includes('CREATE EXTENSION') ||
              statement.includes('CREATE TRIGGER') ||
              statement.includes('CREATE POLICY')) {
            console.log(`⏭️  Skipping statement (may need manual execution): ${statement.substring(0, 50)}...`);
            continue;
          }
          
          throw error;
        }

        console.log(`✅ Statement ${i + 1} executed successfully`);
        
      } catch (statementError) {
        console.error(`❌ Error executing statement ${i + 1}:`, statementError.message);
        console.log(`Statement: ${statement.substring(0, 100)}...`);
        
        // Continue with other statements even if one fails
        continue;
      }
    }

    console.log('🎉 Database initialization completed!');
    
    // Test the connection
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError.message);
    } else {
      console.log('📊 Created tables:', tables.map(t => t.table_name).join(', '));
    }

  } catch (error) {
    console.error('💥 Database initialization failed:', error.message);
    process.exit(1);
  }
}

// Alternative method: Create tables using Supabase client methods
async function createTablesWithClient() {
  console.log('🔄 Creating tables using alternative method...');
  
  try {
    // Create users table
    const { error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);

    if (usersError && usersError.code === 'PGRST116') {
      console.log('📝 Creating basic tables structure...');
      
      // Since we can't execute DDL directly, we'll provide instructions
      console.log(`
🔧 MANUAL SETUP REQUIRED:

Please execute the following in your Supabase SQL Editor:

1. Go to https://supabase.com/dashboard/project/hrlncrvcwhvymwsfmyxi/sql
2. Copy and paste the contents of backend/database/schema.sql
3. Execute the SQL script

Alternatively, you can run the schema in parts:

1. First, create the basic tables
2. Then add the indexes and triggers
3. Finally, set up Row Level Security policies

The schema file contains all necessary SQL commands.
      `);
    } else {
      console.log('✅ Tables already exist or connection successful');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

// Run the initialization
if (process.argv[2] === '--manual') {
  createTablesWithClient();
} else {
  initializeDatabase();
}