import React, { useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { 
  logoutUser, 
  subscribeToAuth, 
  getUserSavedReports, 
  saveSkinReportToFirestore 
} from "../lib/firebase";
import { LogIn, LogOut, User, Bookmark, Check, ShieldCheck, X, Clock, FileText, Loader2 } from "lucide-react";

interface AuthHeaderProps {
  currentReport?: any;
}

export default function AuthHeader({ currentReport }: AuthHeaderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setSavedReports([]);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleSaveReport = async () => {
    if (!user || !currentReport) return;
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await saveSkinReportToFirestore(user.uid, currentReport);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving report:", err);
      alert("Failed to save report to Firestore database");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFetchHistory = async () => {
    if (!user) return;
    setHistoryModalOpen(true);
    setLoadingReports(true);
    try {
      const reports = await getUserSavedReports(user.uid);
      setSavedReports(reports);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoadingReports(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#3D2D29]/60 font-mono">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E3C2B0]" />
        <span>Syncing Firebase Auth...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <div className="flex items-center gap-2">
          {/* User Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F4EDE4] border border-[#E3C2B0]/60 rounded-full shadow-2xs">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || "User"} 
                className="w-5 h-5 rounded-full object-cover border border-[#CBA38E]"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#3D2D29] text-[#FAF6F0] flex items-center justify-center text-[10px] font-bold">
                {user.displayName ? user.displayName[0] : "U"}
              </div>
            )}
            <span className="text-[11px] font-bold text-[#3D2D29] max-w-[100px] truncate hidden sm:inline">
              {user.displayName || user.email?.split("@")[0] || "Member"}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-mono font-bold rounded-full">
              <ShieldCheck className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />
              Firestore Synced
            </span>
          </div>

          {/* Save Current Report Button if report exists */}
          {currentReport && (
            <button
              onClick={handleSaveReport}
              disabled={isSaving}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded-full transition cursor-pointer border ${
                savedSuccess
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-white hover:bg-[#FAF6F0] text-[#3D2D29] border-[#E3C2B0]/80 shadow-2xs"
              }`}
              title="Save skin analysis report to your Firestore database account"
            >
              {isSaving ? (
                <Loader2 className="w-3 h-3 animate-spin text-[#3D2D29]" />
              ) : savedSuccess ? (
                <Check className="w-3 h-3 text-white" />
              ) : (
                <Bookmark className="w-3 h-3 text-[#E879A0]" />
              )}
              <span className="hidden md:inline">{savedSuccess ? "Saved to Cloud" : "Save Report"}</span>
            </button>
          )}

          {/* View Saved Reports History */}
          <button
            onClick={handleFetchHistory}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#FAF6F0] text-[#3D2D29] border border-[#E3C2B0]/80 rounded-full text-[10px] font-mono font-bold transition cursor-pointer shadow-2xs"
            title="View saved reports in Firestore"
          >
            <Clock className="w-3 h-3 text-[#3D2D29]" />
            <span className="hidden md:inline">Saved Scans</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="p-1.5 text-[#3D2D29]/60 hover:text-[#3D2D29] hover:bg-[#E3C2B0]/20 rounded-full transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}

      {/* Saved Reports History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF6F0] border border-[#E3C2B0] rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E3C2B0]/40 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#E879A0]" />
                <h3 className="font-serif font-bold text-base text-[#3D2D29]">Your Saved Firestore Skin Scans</h3>
              </div>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#E3C2B0]/30 flex items-center justify-center text-[#3D2D29] hover:bg-[#E3C2B0]/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loadingReports ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-xs text-[#3D2D29]/60">
                  <Loader2 className="w-5 h-5 animate-spin text-[#3D2D29]" />
                  <span>Loading saved reports from Firestore database...</span>
                </div>
              ) : savedReports.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <FileText className="w-8 h-8 text-[#E3C2B0] mx-auto" />
                  <p className="text-xs font-bold text-[#3D2D29]">No saved reports found yet.</p>
                  <p className="text-[10px] text-[#3D2D29]/60 font-mono">Run a skin analysis and click "Save Report" to sync to your account!</p>
                </div>
              ) : (
                savedReports.map((item, idx) => {
                  const data = item.reportData || {};
                  return (
                    <div 
                      key={item.id || idx}
                      className="p-3 bg-white border border-[#E3C2B0]/50 rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:border-[#3D2D29] transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#3D2D29] text-white rounded text-[10px] font-mono font-bold">
                            Score: {data.skinScore || "N/A"}/100
                          </span>
                          <span className="text-xs font-bold text-[#3D2D29]">{data.skinType || "Skin Profile"}</span>
                        </div>
                        <p className="text-[10px] text-[#3D2D29]/60 font-mono mt-1">
                          Saved: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                        {data.primaryConcern || "Analysis Complete"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
