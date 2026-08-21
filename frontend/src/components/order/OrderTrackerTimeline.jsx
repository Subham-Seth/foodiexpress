import React from 'react';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bike,
  PackageCheck,
  XCircle,
  AlertCircle
} from 'lucide-react';

const OrderTrackerTimeline = ({ orderStatus, timeline = [], estimatedDeliveryTime }) => {
  const steps = [
    { key: 'Order Placed', label: 'Order Placed', icon: Clock, desc: 'We received your order' },
    { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Kitchen acknowledged' },
    { key: 'Preparing', label: 'Preparing', icon: ChefHat, desc: 'Freshly cooking your meal' },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Bike, desc: 'Rider is on the way' },
    { key: 'Delivered', label: 'Delivered', icon: PackageCheck, desc: 'Delivered to your door' }
  ];

  if (orderStatus === 'Cancelled') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-center gap-4 text-rose-800">
        <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-bold text-base">This order was cancelled</h4>
          <p className="text-xs text-rose-600 mt-0.5">
            If you were charged, a full refund will be processed to your original payment method.
          </p>
        </div>
      </div>
    );
  }

  // Determine active step index
  const activeIndex = steps.findIndex((s) => s.key === orderStatus);
  const currentStepIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
      {/* Active State Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Current Status
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-0.5">
            {orderStatus}
          </h3>
        </div>

        {estimatedDeliveryTime && orderStatus !== 'Delivered' && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-2 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-orange-600 animate-spin" />
            <div>
              <p className="text-[10px] text-orange-600 font-bold uppercase">Estimated Delivery</p>
              <p className="text-xs font-black text-slate-800">
                {new Date(estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Visual Stepper */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            // Find matching timeline record for timestamp
            const timelineRecord = timeline.find((t) => t.status === step.key);

            return (
              <div
                key={step.key}
                className={`relative flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                  isCurrent
                    ? 'bg-orange-50/70 border-2 border-orange-500 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50 border border-slate-100'
                    : 'opacity-50'
                }`}
              >
                {/* Step Icon Bubble */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-orange-600 text-white pulse-delivery ring-4 ring-orange-200'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h4 className="font-bold text-xs text-slate-900">{step.label}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{step.desc}</p>

                {timelineRecord && (
                  <span className="text-[10px] font-semibold text-orange-600 mt-2 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                    {new Date(timelineRecord.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Log Accordion / List */}
      {timeline.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Status Logs & Updates
          </h4>
          <div className="space-y-2">
            {timeline.slice().reverse().map((log, index) => (
              <div key={index} className="flex items-start gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.status}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {log.note && <p className="text-slate-500 mt-0.5">{log.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackerTimeline;
