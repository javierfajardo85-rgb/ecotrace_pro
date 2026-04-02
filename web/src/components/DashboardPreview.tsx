export function DashboardPreview() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-ecotrace-50 text-[10px] font-bold text-ecotrace-800 ring-1 ring-inset ring-ecotrace-100">
            E
          </div>
          <span className="text-xs font-medium text-slate-400">
            Merchant Financial Wallet
          </span>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-3">
        <div className="rounded-xl bg-ecotrace-50/60 p-5 ring-1 ring-inset ring-ecotrace-100 sm:col-span-2">
          <div className="text-xs font-medium uppercase tracking-wide text-ecotrace-600">
            Green Operational Credit™ Balance
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-ecotrace-900">
            €452.50
          </div>
          <div className="mt-1 text-sm text-ecotrace-600/70">
            Accumulated from customer green fees
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            This month
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            312
          </div>
          <div className="mt-1 text-sm text-slate-400">
            Transactions recorded
          </div>
        </div>
      </div>

      <div className="border-t border-slate-50 px-6 py-4">
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ecotrace-100 text-xs text-ecotrace-700">
              ✓
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Verified Ad Spend (Google Ads)
              </div>
              <div className="text-xs text-slate-400">
                Automatically matched & settled
              </div>
            </div>
          </div>
          <span className="text-sm font-bold text-slate-900">−€300.00</span>
        </div>
      </div>

      <div className="border-t border-slate-50 bg-slate-50/50 px-6 py-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-ecotrace-700">Success!</span> Your
          customers have automatically funded{" "}
          <span className="font-semibold text-slate-900">66%</span> of your
          marketing spend this month.
        </p>
      </div>
    </div>
  );
}
