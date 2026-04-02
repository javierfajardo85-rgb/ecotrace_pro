export function DashboardPreview() {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-ecotrace-50 text-[10px] font-bold text-ecotrace-800 ring-1 ring-inset ring-ecotrace-200">
            E
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Merchant Financial Wallet
          </span>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-ecotrace-50 p-5 ring-1 ring-inset ring-ecotrace-200 sm:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-ecotrace-700">
            Total Green Credit Balance
          </div>
          <div className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-ecotrace-900">
            €452.50
          </div>
          <div className="mt-1 text-sm text-ecotrace-700/70">
            Accumulated from customer green fees
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            This month
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            312
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Transactions recorded
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ecotrace-100 text-xs text-ecotrace-700">
              ✓
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Verified Ad Spend (Google Ads)
              </div>
              <div className="text-xs text-slate-500">
                Automatically matched & settled
              </div>
            </div>
          </div>
          <span className="text-sm font-bold text-slate-900">−€300.00</span>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-sm leading-relaxed text-slate-600">
          <span className="font-semibold text-ecotrace-800">Success!</span> Your
          customers have automatically funded{" "}
          <span className="font-semibold text-slate-900">66%</span> of your
          marketing spend this month.
        </p>
      </div>
    </div>
  );
}
