import React, { useState, useEffect } from 'react';
import { getMyOffers, respondToOffer } from '../../services/offerService';
import { formatLPA, formatDate } from '../../utils/formatters';
import { Award, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

export default function StudentOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await getMyOffers();
      if (res.success && res.data) {
        setOffers(res.data);
      }
    } catch (err) {
      setError('Failed to fetch offer letters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleResponse = async (offerId, accepted, companyName) => {
    try {
      setError('');
      setSuccessMsg('');
      setRespondingId(offerId);
      const res = await respondToOffer(offerId, accepted);
      if (res.success) {
        setSuccessMsg(
          accepted
            ? `Congratulations! You accepted the offer from ${companyName}. Rule 5 is now enforced for future drives.`
            : `Declined offer from ${companyName}.`
        );
        fetchOffers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record offer response.');
    } finally {
      setRespondingId(null);
    }
  };

  const hasAcceptedOffer = offers.some((o) => o.accepted);
  const acceptedOffer = offers.find((o) => o.accepted);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-emerald-400 text-xs">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between text-rose-400 text-xs">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Placement Offers & Letter Portal</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review official placement offers issued by campus recruiting companies.
        </p>
      </div>

      {/* Rule 5 Advisory Banner */}
      {hasAcceptedOffer && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200 space-y-1">
            <strong className="text-amber-400 font-bold block text-sm">
              Accepted Offer: {acceptedOffer.company_name} ({formatLPA(acceptedOffer.package_lpa)})
            </strong>
            <p className="text-amber-200/80">
              Rule 5 is currently active on your account. You can only apply for companies offering a package of at least <strong>{formatLPA(Number(acceptedOffer.package_lpa) - 5)}</strong> or higher.
            </p>
          </div>
        </div>
      )}

      {/* Offers Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 text-xs">
          No placement offer letters issued yet. Offers will appear here once selection results are finalized.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div
              key={offer.offer_id}
              className={`bg-slate-900 border p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-all ${
                offer.accepted ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-lg font-bold text-white">{offer.company_name}</h2>
                    <p className="text-xs font-medium text-amber-400">{offer.job_profile}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-extrabold shrink-0">
                    {formatLPA(offer.package_lpa)}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                  <div>Offer Issued Date: <strong className="text-slate-200">{formatDate(offer.offer_date)}</strong></div>
                  <div>Location: <strong className="text-slate-200">{offer.location || 'Pan India'}</strong></div>
                </div>
              </div>

              {/* Action Handlers */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {offer.accepted ? (
                  <div className="w-full py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Accepted Placement Offer</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => handleResponse(offer.offer_id, true, offer.company_name)}
                      disabled={respondingId === offer.offer_id}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                    >
                      {respondingId === offer.offer_id ? 'Saving...' : 'Accept Offer'}
                    </button>
                    <button
                      onClick={() => handleResponse(offer.offer_id, false, offer.company_name)}
                      disabled={respondingId === offer.offer_id}
                      className="px-4 py-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 font-semibold text-xs rounded-xl transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
