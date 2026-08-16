import { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  X,
  Globe,
  Cpu,
  Copy,
  ExternalLink,
  Zap,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onTriggerInstall?: () => void;
}

export function ApkGuideModal({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
}: ApkGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'pwa' | 'pwabuilder' | 'capacitor'>('pwa');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://...';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenPwaBuilder = () => {
    const targetUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(currentAppUrl)}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="apk-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                Build & Pasang APK Android
              </h3>
              <p className="text-xs text-slate-500">
                Pilih metode pembuatan file .APK atau pasang instan di HP Android
              </p>
            </div>
          </div>
          <button
            id="close-apk-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-2 gap-1.5 overflow-x-auto">
          <button
            id="tab-pwa-btn"
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>1. Install Instan (WebAPK)</span>
          </button>
          <button
            id="tab-pwabuilder-btn"
            onClick={() => setActiveTab('pwabuilder')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'pwabuilder'
                ? 'bg-white text-teal-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>2. Generate File .APK</span>
          </button>
          <button
            id="tab-capacitor-btn"
            onClick={() => setActiveTab('capacitor')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'capacitor'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>3. Android Studio / Cap</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Quick Copy Link Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="truncate w-full text-xs text-slate-500 font-mono">
              <span className="text-slate-400">URL Aplikasi: </span>
              <span className="text-blue-700 font-medium">{currentAppUrl}</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto shrink-0 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 transition cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Link</span>
                </>
              )}
            </button>
          </div>

          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" /> WebAPK Otomatis (Rekomendasi)
                  </span>
                  <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-300 font-medium">
                    Otomatis Tanpa Download File
                  </span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  Aplikasi ini sudah dilengkapi <code>manifest.json</code> & <code>ServiceWorker</code>. Ketika dipasang, Android akan otomatis membuat WebAPK yang bekerja persis seperti aplikasi APK asli (terbuka layar penuh, ada icon di menu HP, dan bekerja cepat secara offline).
                </p>

                {deferredPrompt && onTriggerInstall && (
                  <div className="pt-2">
                    <button
                      onClick={onTriggerInstall}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Klik untuk Pasang Sekarang ke Perangkat Ini</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Langkah Memasang di HP Android:
                </h4>

                <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Buka Link di Google Chrome HP</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Buka link aplikasi ini di browser Chrome atau Samsung Internet pada HP Android Anda.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">
                      Tekan Tombol Menu Titik Tiga (⋮) di Pojok Kanan Atas
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih menu <strong className="text-purple-700">"Tambahkan ke Layar Utama"</strong> atau <strong className="text-purple-700">"Install Aplikasi"</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Selesai! Icon Mini Excel Terpasang</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Aplikasi siap digunakan kapan saja dari layar utama HP Anda dengan auto-save lokal aktif.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pwabuilder' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-teal-600" /> Download File .APK Murni (Gratis & Resmi)
                </span>
                <p className="text-slate-700 text-xs leading-relaxed">
                  Anda bisa meng-compile URL web ini menjadi file installer <code>.apk</code> murni menggunakan <strong>PWABuilder</strong> (layanan gratis Microsoft untuk Android APK).
                </p>

                <div className="pt-2">
                  <button
                    onClick={handleOpenPwaBuilder}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20 transition cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka PWABuilder & Generate File .APK Sekarang</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Cara Download File .APK via PWABuilder:
                </h4>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 text-xs">
                    1. Buka tautan PWABuilder di atas
                  </span>
                  <p className="text-xs text-slate-500">
                    URL aplikasi Anda otomatis dicek skor kompatibilitas PWA & Manifest-nya.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 text-xs">
                    2. Klik tombol "Package for Stores" &rarr; Pilih "Android"
                  </span>
                  <p className="text-xs text-slate-500">
                    Pilih opsi download file APK / signed bundle.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 text-xs">
                    3. Install file .APK di HP Android Anda
                  </span>
                  <p className="text-xs text-slate-500">
                    File APK siap dikirimkan ke siapa saja atau dipasang di HP Android mana pun!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capacitor' && (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <p className="text-xs text-indigo-900">
                  Untuk developer yang ingin mem-build APK secara native dengan Android SDK / Android Studio:
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 space-y-2 leading-relaxed">
                <p className="text-slate-500">// 1. Download / Export zip project dari menu</p>
                <p className="text-blue-400">npm run build</p>
                
                <p className="text-slate-500 mt-2">// 2. Tambahkan Capacitor Android ke project</p>
                <p className="text-emerald-400">npm install @capacitor/core @capacitor/cli @capacitor/android</p>
                <p className="text-emerald-400">npx cap init "Mini Excel" com.miniexcel.app --web-dir=dist</p>
                <p className="text-emerald-400">npx cap add android</p>
                <p className="text-emerald-400">npx cap copy</p>
                <p className="text-emerald-400">npx cap open android</p>

                <p className="text-slate-500 mt-2">// 3. Di Android Studio: Pilih Build &rarr; Build APK (debug/release)</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Siap dipakai di Android, iOS, Windows, Mac</span>
          </div>
          <button
            id="modal-ok-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition cursor-pointer shadow-sm shadow-blue-600/20"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
