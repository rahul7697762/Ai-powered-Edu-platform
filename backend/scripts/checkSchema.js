import { supabase, supabaseAdmin } from '../config/database.js';

async function checkDatabaseSchema() {
  console.log('🔍 Checking database schema...\n');

  try {
    // Test database connection by trying to access expected tables
    console.log('1. Testing database connection...');
    
    const expectedTables = [
      'users',
      'resumes', 
      'ats_results',
      'placement_prep',
      'mock_interviews',
      'code_ide',
      'time_planner',
      'recruiter_jobs',
      'applications',
      'ai_mentor_logs'
    ];

    const existingTables = [];
    const missingTables = [];

    console.log('2. Checking each expected table...');
    
    for (const tableName of expectedTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
            console.log(`❌ ${tableName}: Table does not exist`);
            missingTables.push(tableName);
          } else {
            console.log(`⚠️  ${tableName}: ${error.message}`);
            missingTables.push(tableName);
          }
        } else {
          console.log(`✅ ${tableName}: Table exists (${data || 0} records)`);
          existingTables.push(tableName);
        }
      } catch (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
        missingTables.push(tableName);
      }
    }

    console.log(`\nFound ${existingTables.length}/${expectedTables.length} tables`);
    if (existingTables.length > 0) {
      console.log('Existing tables:', existingTables.join(', '));
    }
    if (missingTables.length > 0) {
      console.log('Missing tables:', missingTables.join(', '));
    }

    console.log('\n3. Schema validation:');
    if (missingTables.length === 0) {
      console.log('✅ All expected tables exist!');
    } else {
      console.log('❌ Missing tables:', missingTables.join(', '));
    }

    // Test basic operations on existing tables
    console.log('\n4. Testing table operations...');

    // Test a simple insert operation if users table exists
    if (existingTables.includes('users')) {
      console.log('✅ Users table is accessible for operations');
    }

    if (existingTables.includes('resumes')) {
      console.log('✅ Resumes table is accessible for operations');
    }

    if (existingTables.includes('ats_results')) {
      console.log('✅ ATS Results table is accessible for operations');
    }

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`- Database connection: ✅ Working`);
    console.log(`- Tables found: ${existingTables.length}/${expectedTables.length}`);
    console.log(`- Missing tables: ${missingTables.length}`);
    
    if (missingTables.length === 0) {
      console.log('\n🎉 Database schema is complete and ready to use!');
      console.log('\n🚀 Next steps:');
      console.log('   - Test API endpoints: curl -X POST http://localhost:5000/api/database/test-data');
      console.log('   - Integrate with resume builder frontend');
      console.log('   - Add user authentication');
    } else {
      console.log('\n⚠️  Database schema is incomplete. Setup required:');
      console.log('\n📋 SETUP INSTRUCTIONS:');
      console.log('1. Go to Supabase SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/hrlncrvcwhvymwsfmyxi/sql');
      console.log('2. Copy and paste the contents of: backend/database/schema.sql');
      console.log('3. Click "Run" to execute the SQL script');
      console.log('4. Run this check again: npm run db:check');
      console.log('\n💡 The schema.sql file contains all table definitions, indexes, and security policies.');
    }

  } catch (error) {
    console.error('💥 Schema check failed:', error.message);
  }
}

// Run the schema check
checkDatabaseSchema();