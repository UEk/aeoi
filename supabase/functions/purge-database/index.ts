import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from('validation_error').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('tin_index').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('aeoi_task').delete().neq('task_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('aeoi_record').delete().neq('record_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('aeoi_case').delete().neq('case_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('file_receipt').delete().neq('file_id', '00000000-0000-0000-0000-000000000000');

    return new Response(
      JSON.stringify({ success: true, message: 'Database purged successfully' }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Purge error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
