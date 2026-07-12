import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../utils/api";

export default function ClusterQuestions() {
  // Pertanyaan diambil dari namespace i18n "clusterQuestions" sehingga
  // otomatis berganti bahasa mengikuti pilihan ID/EN di Navbar.
  const { t } = useTranslation("clusterQuestions");
  const { clusterId, stakeholderId } = useParams();
  const id = clusterId;
  const questions = t("questions", { returnObjects: true });
  const clusterName = id ? (t(`clusterNames.${id}`, { defaultValue: id.charAt(0).toUpperCase() + id.slice(1) })) : "";
  const [answers, setAnswers] = useState({});
  const [openIndex, setOpenIndex] = useState(0);

  // Definisikan clusterOrder
  const clusterOrder = Object.keys(questions);

 useEffect(() => {
  const saved = localStorage.getItem(`cluster-${id}`);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.answers) {
      setAnswers(parsed.answers);
      setOpenIndex(0);
    }
    if (parsed.value) {
      parsed.value = String(parsed.value);  // 🔧 pastikan string
    }
  }
}, [id]);


  const handleAnswer = (subCluster, qIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [`${subCluster}-${qIndex}`]: value,
    }));
  };

  const calculateClusterValue = (answers) => {
  const yesCount = Object.values(answers).filter(a => a === "Yes").length;
  if (yesCount >= 3) return "High";
  if (yesCount === 2) return "Medium";
  if (yesCount === 1) return "Low";
  return null;
};

const saveProgress = async (clusterId, answers, row = null) => {
  // hitung High/Medium/Low
  const clusterValue = calculateClusterValue(answers);

  // simpan ke localStorage dengan value
localStorage.setItem(
  `cluster-${clusterId}`,
  JSON.stringify({ completed: true, answers, value: String(clusterValue || "") })
);

  try {
    const SHEET_ID = '1GV3WqppPH0kvUrLA0zrXfqawAsCM5RhnB_Yp_fVE44Q';

    // kirim juga ke backend
    const payload = { clusterId, answers, value: clusterValue };
    if (row !== null && row !== undefined && row !== '') {
      payload.row = Number(row);
    }
    console.log('KIRIM PAYLOAD:', payload);

    const res = await fetch(`${API_BASE_URL}/sheets/${SHEET_ID}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('Gagal simpan ke server:', res.status, data?.message || res.statusText);
      return;
    }
    console.log('Berhasil simpan ke server:', data);
  } catch (error) {
    console.error('Error fetch:', error);
  }
};

  const isSubClusterComplete = (subCluster, qs) =>
    qs.every((_, idx) => answers[`${subCluster}-${idx}`]);

  const isClusterComplete = (clusterKey) => {
    if (!questions[clusterKey]) return false;
    const cluster = questions[clusterKey];
    if (Array.isArray(cluster)) {
      return cluster.every((_, idx) => answers[`${clusterKey}-${idx}`]);
    }
    return Object.entries(cluster).every(([subCluster, qs]) =>
      isSubClusterComplete(subCluster, qs)
    );
  };

  return (
    <div>
      <Navbar />

      {/* Bagian atas: Overview & Daftar Cluster */}
      <div className="mt-20 flex gap-10">
        <section
          style={{ backgroundImage: "url('/images/bgnew.jpg')" }}
          className="flex-1 m-5 p-4 rounded-xl flex flex-col gap-5"
        >
          <h1 className="text-white">{t("overviewTitle")}</h1>
          <p className="text-white">
            {t("overviewText")}
          </p>
        </section>

        <section
          style={{ backgroundImage: "url('/images/bgnew.jpg')" }}
          className="flex-1 m-5 p-4 rounded-xl flex flex-col gap-2 text-white overflow-y-auto max-h-64"
        >
          {questions[id] && typeof questions[id] === "object"
            ? Object.keys(questions[id]).map((subCluster, idx) => (
              <div key={idx}>{subCluster}</div>
            ))
            : <div>{clusterName}</div>}
        </section>
      </div>

      <div className="m-5 flex flex-col gap-4">
        {questions[id] ? (
          typeof questions[id] === "object" ? (
            Object.entries(questions[id]).map(([subCluster, qs], idx) => {
              const clusterAlreadyDone = isClusterComplete(id);
              const isLocked = !clusterAlreadyDone && idx > openIndex;

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-300 overflow-hidden bg-blue-900 text-white"
                >
                  <button
                    disabled={isLocked}
                    onClick={() => setOpenIndex(idx)}
                    className="w-full bg-blue-100 text-left text-lg font-semibold text-blue-900 p-3 flex justify-between items-center"
                  >
                    {subCluster} {t("questionsSuffix")}
                    <span>{openIndex === idx ? "▲" : "▼"}</span>
                  </button>

                  {openIndex === idx && !isLocked && (
                    <div className="p-4 space-y-4">
                      {qs.map((q, qIndex) => (
                        <div
                          key={qIndex}
                          className="flex justify-between items-start gap-4"
                        >
                          <p className="max-w-[80%] text-justify leading-relaxed pr-2">{q}</p>
                          <div className="flex gap-10 shrink-0">
                            <label>
                              <input
                                type="radio"
                                name={`${id}-${subCluster}-${qIndex}`}
                                value="Yes"
                                checked={answers[`${subCluster}-${qIndex}`] === "Yes"}
                                onChange={(e) =>
                                  handleAnswer(subCluster, qIndex, e.target.value)
                                }
                              />{" "}
                              {t("yes")}
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`${id}-${subCluster}-${qIndex}`}
                                value="No"
                                checked={answers[`${subCluster}-${qIndex}`] === "No"}
                                onChange={(e) =>
                                  handleAnswer(subCluster, qIndex, e.target.value)
                                }
                              />{" "}
                              {t("no")}
                            </label>
                          </div>
                        </div>
                      ))}

                      {isSubClusterComplete(subCluster, qs) ? (
                        <div className="flex justify-end ">
                          <button
                            onClick={() => {
                              if (idx === Object.entries(questions[id]).length - 1) {
                                saveProgress(id, answers);
                                alert(t("clusterSavedAlert"));
                              } else {
                                setOpenIndex(idx + 1);
                              }
                            }}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow ml-auto"
                          >
                            {idx === Object.entries(questions[id]).length - 1
                              ? t("finishButton")
                              : t("completeNextButton")}
                          </button>
                        </div>
                      ) : (
                        !clusterAlreadyDone && (
                          <p className="mt-4 text-yellow-300">
                            {t("answerAllWarning")}
                          </p>
                        )
                      )}
                    </div>
                  )}

                  {!clusterAlreadyDone && isLocked && (
                    <div className="p-4 text-red-500 font-medium">
                      {t("completePreviousWarning")}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>{t("arrayClusterNote")}</p>
          )
        ) : (
          <p>{t("noQuestions")}</p>
        )}
      </div>

      {/* Tombol Continue ke cluster berikutnya */}
      <div className="flex justify-end items-center m-5" style={{gap: '1cm'}}>
        <button
          onClick={() => {
            window.location.href = stakeholderId ? `/stakeholderprofilesetup/${stakeholderId}` : "/stakeholderprofilesetup";
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-lg font-bold"
        >
          {t("backButton")}
        </button>
        {isClusterComplete(id) ? (
          <button
            onClick={() => {
              saveProgress(id, answers);
              const currentIndex = clusterOrder.indexOf(id);
              if (currentIndex < clusterOrder.length - 1) {
                const nextCluster = clusterOrder[currentIndex + 1];
                window.location.href = stakeholderId ? `/cluster/${nextCluster}/${stakeholderId}` : `/cluster/${nextCluster}`;
              } else {
                // Semua cluster sudah selesai, kembali ke stakeholder profile setup
                alert(t("allClustersDoneAlert"));
                window.location.href = stakeholderId ? `/stakeholderprofilesetup/${stakeholderId}` : "/stakeholderprofilesetup";
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg font-bold"
          >
            {t("continueButton")}
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-400 text-white px-6 py-3 rounded-lg font-bold cursor-not-allowed"
          >
            {t("completeAllFirstButton")}
          </button>
        )}
      </div>
    </div>
  );
}
