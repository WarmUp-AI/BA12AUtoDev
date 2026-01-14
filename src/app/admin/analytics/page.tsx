'use client';

import { useState, useEffect } from 'react';
import { AnalyticsStats } from '@/types/analytics';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/analytics/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-gold)] opacity-60">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[var(--color-gold)]">Analytics</h1>

      {/* Total Views */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-[var(--color-gold)] opacity-60 text-sm mb-2">Total Views</div>
            <div className="text-4xl font-bold text-[var(--color-gold)]">{stats.totalViews}</div>
          </div>
          <div>
            <div className="text-[var(--color-gold)] opacity-60 text-sm mb-2">Contact Submissions</div>
            <div className="text-4xl font-bold text-[var(--color-gold)]">{stats.recentSubmissions.length}</div>
          </div>
          <div>
            <div className="text-[var(--color-gold)] opacity-60 text-sm mb-2">Popular Makes</div>
            <div className="text-4xl font-bold text-[var(--color-gold)]">{stats.viewsByMake.length}</div>
          </div>
        </div>
      </div>

      {/* Views by Make */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Views by Make</h2>
        <div className="space-y-3">
          {stats.viewsByMake.map((item) => (
            <div key={item.make} className="flex items-center justify-between">
              <span className="text-[var(--color-gold)]">{item.make}</span>
              <div className="flex items-center gap-4 flex-1 max-w-md ml-4">
                <div className="flex-1 bg-[var(--color-bg)] rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-[var(--color-gold)] h-full rounded-full"
                    style={{
                      width: `${(item.count / stats.totalViews) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[var(--color-gold)] font-bold w-12 text-right">{item.count}</span>
              </div>
            </div>
          ))}
          {stats.viewsByMake.length === 0 && (
            <p className="text-[var(--color-gold)] opacity-60 text-center py-4">No view data yet</p>
          )}
        </div>
      </div>

      {/* Recent Views */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Most Viewed Cars</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Car</th>
                <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Views</th>
                <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Last Viewed</th>
                <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentViews.map((view) => (
                <tr key={view.car_id} className="border-b border-[var(--color-border)]">
                  <td className="py-3 px-4 text-[var(--color-gold)]">{view.car_title}</td>
                  <td className="py-3 px-4 text-[var(--color-gold)]">{view.view_count}</td>
                  <td className="py-3 px-4 text-[var(--color-gold)] opacity-60 text-sm">
                    {new Date(view.last_viewed).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/car/${view.car_id}`}
                      className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] underline text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.recentViews.length === 0 && (
            <p className="text-[var(--color-gold)] opacity-60 text-center py-4">No view data yet</p>
          )}
        </div>
      </div>

      {/* Contact Submissions */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Recent Contact Submissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Name</th>
                <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Email</th>
                <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Car Interest</th>
                <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b border-[var(--color-border)]">
                  <td className="py-3 px-4 text-[var(--color-gold)]">{submission.name}</td>
                  <td className="py-3 px-4 text-[var(--color-gold)] text-sm">{submission.email}</td>
                  <td className="py-3 px-4 text-[var(--color-gold)] text-sm">
                    {submission.car_title || 'General Enquiry'}
                  </td>
                  <td className="py-3 px-4 text-[var(--color-gold)] opacity-60 text-sm">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.recentSubmissions.length === 0 && (
            <p className="text-[var(--color-gold)] opacity-60 text-center py-4">No submissions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
