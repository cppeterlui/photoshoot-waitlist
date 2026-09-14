import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  // Format keys to match frontend expectation
  const waitlist = data.map(item => ({
    id: String(item.id),
    name: item.name,
    phone: item.phone,
    groupSize: item.group_size,
    status: item.status,
    joinedAt: item.joined_at
  }));

  return NextResponse.json({ waitlist });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'JOIN') {
      const { name, phone, groupSize } = body;
      const { data, error } = await supabase
        .from('waitlist')
        .insert([{ name, phone, group_size: Number(groupSize) || 1 }])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ 
        success: true, 
        item: {
          id: String(data.id),
          name: data.name,
          phone: data.phone,
          groupSize: data.group_size,
          status: data.status,
          joinedAt: data.joined_at
        } 
      });
    }

    if (action === 'CALL_NEXT') {
      // Complete currently in-service customers
      await supabase
        .from('waitlist')
        .update({ status: 'completed' })
        .eq('status', 'in-service');

      // Fetch first waiting item
      const { data: waitingList } = await supabase
        .from('waitlist')
        .select('id')
        .eq('status', 'waiting')
        .order('id', { ascending: true })
        .limit(1);

      if (waitingList && waitingList.length > 0) {
        await supabase
          .from('waitlist')
          .update({ status: 'in-service' })
          .eq('id', waitingList[0].id);
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'CANCEL') {
      const { id } = body;
      await supabase.from('waitlist').delete().eq('id', id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
