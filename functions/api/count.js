export async function onRequest(context) {
  const { env } = context;
  const kv = env.COUNTERS;

  const now = new Date();
  const monthKey = `month_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [allTime, monthly] = await Promise.all([
    kv.get('all_time'),
    kv.get(monthKey)
  ]);

  const newAllTime = (parseInt(allTime) || 0) + 1;
  const newMonthly = (parseInt(monthly) || 0) + 1;

  await Promise.all([
    kv.put('all_time', String(newAllTime)),
    kv.put(monthKey, String(newMonthly))
  ]);

  return new Response(JSON.stringify({
    allTime: newAllTime,
    monthly: newMonthly
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
