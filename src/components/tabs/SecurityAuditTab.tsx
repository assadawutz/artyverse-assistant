import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  FileCode,
} from 'lucide-react';

export const SecurityAuditTab: React.FC = () => {
  const [platform, setPlatform] = useState('ios');
  const [codeToAudit, setCodeToAudit] = useState(`// iOS Healthcare App - Token & Health Data Storage
import SwiftUI
import Security

class HealthDataStore {
    // ⚠️ Security Audit Target:
    // Storing sensitive biometric patient tokens in UserDefaults (Vulnerable to jailbreak extraction)
    func savePatientToken(token: String) {
        UserDefaults.standard.set(token, forKey: "user_auth_token")
    }

    func loadPatientToken() -> String? {
        return UserDefaults.standard.string(forKey: "user_auth_token")
    }
}`);
  const [loading, setLoading] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleCodes = [
    {
      title: 'Vulnerable iOS Token (UserDefaults)',
      code: `class SessionManager {
    func storeSecret(token: String) {
        UserDefaults.standard.set(token, forKey: "bearer_token")
    }
}`,
    },
    {
      title: 'Compliant iOS Keychain (SecItemAdd)',
      code: `import Security

struct KeychainHelper {
    static func save(key: String, data: Data) -> OSStatus {
        let query = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ] as [String: Any]
        SecItemDelete(query as CFDictionary)
        return SecItemAdd(query as CFDictionary, nil)
    }
}`,
    },
    {
      title: 'Android Keystore (FIPS 140-3)',
      code: `val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val encryptedPrefs = EncryptedSharedPreferences.create(
    context,
    "secure_elder_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)`,
    },
  ];

  const handleAudit = async () => {
    if (!codeToAudit.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/security-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToAudit,
          platform,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAuditReport(data.auditReport);
    } catch (err: any) {
      console.error('Audit error:', err);
      alert('Failed to audit code: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-5">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">
                OWASP Mobile Top 10 & Keychain/Keystore Audit
              </h2>
              <p className="text-[11px] text-slate-400">
                Automated security compliance verification powered by Gemini 4 Argon
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
            gemini-4-argon
          </span>
        </div>

        {/* Security Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>M1: Platform Credentials</span>
          </div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>M2: Inadequate Data Protection</span>
          </div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>M4: Auth & Biometrics</span>
          </div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>HIPAA / PDPA At Rest</span>
          </div>
        </div>
      </div>

      {/* Preset Code Snippets */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Load Sample Code to Audit:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleCodes.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCodeToAudit(s.code);
                if (s.title.includes('iOS')) setPlatform('ios');
                if (s.title.includes('Android')) setPlatform('android');
              }}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs transition"
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-400">Mobile Code Snippet to Audit:</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Target OS:</span>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value="ios">Apple iOS (Swift / Keychain)</option>
              <option value="android">Android (Kotlin / Keystore)</option>
              <option value="flutter">Flutter Cross-Platform</option>
              <option value="react-native">React Native</option>
            </select>
          </div>
        </div>

        <textarea
          value={codeToAudit}
          onChange={(e) => setCodeToAudit(e.target.value)}
          rows={7}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-indigo-300 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
        />
      </div>

      <button
        onClick={handleAudit}
        disabled={loading || !codeToAudit.trim()}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>{loading ? 'Running Automated OWASP & Cryptographic Audit...' : 'Execute Mobile Security Audit'}</span>
      </button>

      {/* Audit Report Viewer */}
      {auditReport && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-indigo-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>OWASP Mobile Audit Findings & Remediations</span>
            </span>

            <button
              onClick={() => {
                navigator.clipboard.writeText(auditReport);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center gap-1 text-slate-300 font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>
          </div>

          <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto bg-slate-950 p-3 rounded-xl border border-slate-800 font-sans">
            {auditReport}
          </div>
        </div>
      )}
    </div>
  );
};
