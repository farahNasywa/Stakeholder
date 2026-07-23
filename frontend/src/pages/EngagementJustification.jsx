import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../utils/api";

const JUSTIFICATION_TRANSLATIONS_EN = {
  "Mengatur, menerbitkan, mengelola, dan menarik regulasi serta perizinan di sektor usaha hulu migas dan energi":
    "Regulate, issue, manage, and revoke regulations and permits in the upstream oil, gas, and energy sector",
  "Mengelola tata ruang dan peraturan kawasan khusus terkait energi dan migas":
    "Manage spatial planning and special area regulations related to energy, oil, and gas",
  "Melakukan pengawasan teknis, lingkungan, ketenagakerjaan, dan kepatuhan hukum di sektor migas dan energi":
    "Conduct technical, environmental, labor, and legal compliance supervision in the oil, gas, and energy sector",
  "Bertanggung jawab dalam penegakan hukum, penyidikan, dan penyelesaian sengketa":
    "Responsible for law enforcement, investigation, and dispute resolution",
  "Malakukan audit keuangan dan pelaksanaan kegiatan hulu migas":
    "Conduct financial audits and oversight of upstream oil and gas activities",
  "Mengelola perizinan investasi, fasilitasi investasi, dan pengawasan investasi di sektor hulu migas":
    "Manage investment licensing, investment facilitation, and investment oversight in upstream oil and gas",
  "Bertanggung jawab atas alokasi dana proyek, pengawasan anggaran, serta audit fiskal dan keuangan":
    "Responsible for project fund allocation, budget oversight, and fiscal/financial audits",
  "Mengelola kepemilikan Participating Interest (PI) dan kemitraan BUMD":
    "Manage Participating Interest (PI) ownership and BUMD partnerships",
  "Mengatur dan mengawasi keamanan fasilitas migas dan aset strategis terkait":
    "Regulate and supervise the security of oil and gas facilities and related strategic assets",
  "Melakukan koordinasi keamanan wilayah dan patroli rutin":
    "Coordinate regional security and conduct routine patrols",
  "Mengelola komunikasi, koordinasi dengan masyarakat, pelaksanaan program CSR, dan resolusi konflik sosial di wilayah kerja":
    "Manage communication, community coordination, CSR program implementation, and social conflict resolution in operational areas",
  "Bertanggung jawab dalam pengawasan energi terbarukan, integrasi transisi energi ke net-zero, dan pengembangan kebijakan energi berkelanjutan":
    "Responsible for renewable energy supervision, net-zero energy transition integration, and sustainable energy policy development",
  "Mengelola regulasi terkait perubahan iklim, emisi karbon, dan tata kelola dekarbonisasi sektor energi":
    "Manage regulations related to climate change, carbon emissions, and decarbonization governance in the energy sector",
  "Aktif melakukan lobi kebijakan di tingkat regional dan sinkronisasi kebijakan pusat-daerah":
    "Actively engage in regional policy lobbying and central-regional policy synchronization",
  "Terlibat dalam penyusunan atau pelaporan lampiran RPJMD dan berkoordinasi dengan DPRD Komisi Energi":
    "Involved in drafting or reporting RPJMD annexes and coordinating with Regional Parliament (DPRD) Energy Commission",
  "Memfasilitasi forum dialog kebijakan dan advokasi aspirasi masyarakat":
    "Facilitate policy dialogue forums and community aspiration advocacy",
  "Mengawasi proyek energi dan migas di tingkat lokal dan daerah":
    "Supervise energy and oil/gas projects at the local and regional levels",
  "Melakukan pengawasan fiskal, APBN/APBD, serta implementasi kebijakan di sektor energi":
    "Conduct fiscal supervision of APBN/APBD and policy implementation in the energy sector",
  "Memfasilitasi investasi daerah dan pengelolaan investasi migas":
    "Facilitate regional investment and oil and gas investment management",
  "Menetapkan atau mengawasi standar teknis seperti gas pipeline dan integritas jaringan":
    "Set or supervise technical standards such as gas pipelines and network integrity",
  "Mendukung pelatihan nasional dan penyebaran praktik terbaik di industri energi":
    "Support national training and dissemination of best practices in the energy industry",
  "Melakukan investigasi di sektor migas dan pelaporan lifting":
    "Conduct investigations in the oil and gas sector and lifting reporting",
  "Mengawasi pelaksanaan kebijakan perizinan dan menangani pelanggaran lingkungan":
    "Supervise the implementation of licensing policies and address environmental violations",
  "Mengawasi Program CSR dan resolusi konflik sosial di tingkat lokal":
    "Supervise CSR programs and social conflict resolution at the local level",
  "Berperan dalam advokasi masyarakat adat dan perlindungan hak atas tanah":
    "Play a role in indigenous community advocacy and land rights protection",
  "Memfasilitasi konsultasi AMDAL dan dialog publik terkait dampak sosial dan lingkungan":
    "Facilitate AMDAL consultations and public dialogue regarding social and environmental impacts",
  "Melakukan atau terlibat dalam pendidikan masyarakat pra dan pasca eksplorasi dan mediasi sengketa sosial":
    "Engage in pre- and post-exploration community education and social dispute mediation",
  "Memfasilitasi forum koordinasi teknis lintas sektor dan melakukan audit CSR":
    "Facilitate cross-sector technical coordination forums and conduct CSR audits",
  "Memantau dampak sosial dan integrasi program pembangunan melalui musrenbang dan advokasi pemangku kepentingan":
    "Monitor social impacts and development program integration through Musrenbang and stakeholder advocacy",
  "Melakukan verifikasi sosial-lingkungan dan transparansi fiskal migas":
    "Conduct social-environmental verification and oil/gas fiscal transparency",
  "Memiliki kewenangan formal dalam pengaturan, perizinan, pengawasan teknis, dan pelaksanaan kebijakan sektor migas":
    "Possess formal authority in regulation, licensing, technical supervision, and policy execution in the oil and gas sector",
  "Memiliki peran dalam pengelolaan izin lokal dan pengawasan lingkungan proyek migas":
    "Have a role in local permit management and environmental supervision of oil and gas projects",
  "Memiliki pengaruh dalam membentuk opini publik dan penerimaan masyarakat terhadap proyek":
    "Exert influence in shaping public opinion and community acceptance of the project",
  "Terlibat dalam pelaksanaan teknis proyek dan pemenuhan standar operasional":
    "Involved in technical project execution and operational standards compliance",
  "Menyediakan pembiayaan proyek atau berperan dalam penilaian kelayakan finansial":
    "Provide project financing or participate in financial feasibility assessments",
  "Memiliki pengaruh terhadap keputusan investasi dalam proyek migas":
    "Exert influence over investment decisions in oil and gas projects",
  "Berperan sebagai penasihat teknis dan kebijakan untuk proyek migas":
    "Serve as technical and policy advisors for oil and gas projects",
  "Menyediakan data, informasi, atau rekomendasi strategis untuk mendukung pelaksanaan proyek":
    "Provide data, information, or strategic recommendations to support project execution",
  "Terlibat dalam koordinasi komunikasi antar lembaga terkait proyek":
    "Involved in inter-agency communication coordination related to the project",
  "Berperan sebagai fasilitator komunikasi dan program sosial di wilayah proyek":
    "Serve as communication facilitators and social program coordinators in project areas",
  "Memiliki pengaruh lokal dalam mendorong atau menolak proyek secara sosial-politik":
    "Have local influence in socially/politically supporting or resisting the project",
  "Menyampaikan aspirasi dan keluhan masyarakat terkait proyek":
    "Convey community aspirations and grievances regarding the project",
  "Terlibat dalam advokasi lingkungan di sekitar wilayah proyek":
    "Engage in environmental advocacy around project areas",
  "Berperan dalam menilai risiko dan melakukan pengawasan teknis terhadap proyek":
    "Play a role in assessing risk and conducting technical project supervision",
  "Memberikan masukan operasional atau pembiayaan jangka pendek untuk proyek migas":
    "Provide operational input or short-term financing for oil and gas projects",
  "memiliki kepentingan besar dalam pajak, ketenagakerjaan lokal, dan isu lingkungan.":
    "Have strong interests in taxes, local employment, and environmental issues.",
  "Memiliki kontrol penuh atas proyek dan mengharapkan keuntungan finansial tinggi.":
    "Maintain full project control and expect high financial returns.",
  "Memantau dampak langsung proyek, dapat menolak, menjadi mediator, dan memengaruhi opini publik.":
    "Monitor direct project impacts, mediate disputes, and influence public opinion.",
  "Melindungi fasilitas proyek dan mendukung keamanan serta operasi di lapangan.":
    "Protect project facilities and support site security and field operations.",
  "Berhak atas kompensasi, berperan dalam negosiasi harga, dan dapat melakukan aksi penolakan.":
    "Entitled to compensation, participate in price negotiations, and hold leverage in land decisions.",
  "Memperjuangkan hak tenaga kerja lokal dan mengontrol serapan tenaga kerja proyek.":
    "Advocate for local labor rights and oversee local workforce absorption.",
  "Terdampak oleh penggunaan lahan proyek dan terlibat dalam isu lingkungan serta norma adat.":
    "Affected by project land use and involved in environmental issues and customary norms.",
  "Memiliki pengaruh melalui arah kebijakan energi nasional yang memengaruhi proyek.":
    "Exert influence through national energy policy directions impacting the project.",
  "Mendukung pelaksanaan proyek lewat regulasi lokal dan fasilitasi program.":
    "Support project execution through local regulations and program facilitation.",
  "Memberikan dukungan teknis dan administratif, meskipun bukan pengawas utama.":
    "Provide technical and administrative support, though not acting as primary regulators.",
  "Memberi nasihat teknis dan menjaga reputasi profesional dalam proyek":
    "Provide technical advice and uphold professional reputation within the project",
  "Terlibat dalam analisis independen dan evaluasi proyek":
    "Involved in independent analysis and project evaluation",
  "Berkontribusi membentuk opini publik melalui liputan dan kerja sama informasi.":
    "Contribute to shaping public opinion through media coverage and information sharing.",
  "Memengaruhi persepsi publik dan mendukung komunikasi proyek.":
    "Influence public perception and support project communications.",
  "Aktif dalam advokasi komunitas dan dukungan kegiatan sosial proyek.":
    "Active in community advocacy and social project support.",
  "Berperan dalam memantau dampak sosial dan bekerja sama dalam penyediaan data lapangan.":
    "Monitor social impacts and collaborate in field data provision.",
  "Mendukung kegiatan logistik dan keamanan proyek secara langsung.":
    "Directly support project logistics and site security.",
  "Mengandalkan pasokan migas dari proyek untuk kelangsungan usahanya.":
    "Rely on project oil and gas supply for business continuity.",
};

export default function EngagementJustification() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [stakeholder, setStakeholder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const translateJustificationItem = (text, currentLang) => {
    if (!text) return "";
    if (currentLang === "en") {
      const trimmed = text.trim();
      return JUSTIFICATION_TRANSLATIONS_EN[trimmed] || text;
    }
    return text;
  };

  const formatJustification = (text) => {
    if (!text) return [];
    return text
      .split(/\r?\n/)
      .map(line => line.replace(/^\s*\d+\.\s*/, "").trim())
      .filter(line =>
        line.length > 0 &&
        !/^Q\d+/i.test(line) &&
        !/^(Yes|No)$/i.test(line) &&
        !/Impacted by Project/i.test(line)
      );
  };

  useEffect(() => {
    const fetchStakeholderData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/stakeholders/${id}`);
        setStakeholder(response.data);
      } catch (err) {
        setError(t("engagementJustification.loadError"));
        console.error("Error fetching stakeholder data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStakeholderData();
    } else {
      setError(t("engagementJustification.idMissingError"));
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20, color: "#374151" }}>
        <Navbar />
        {t("engagementJustification.loadingText")}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#dc2626", textAlign: "center", padding: 20 }}>
        <Navbar />
        <div>{t("engagementJustification.errorPrefix")}: {error}</div>
        <p style={{ fontSize: 14, marginTop: 8 }}>{t("engagementJustification.errorHint")}</p>
      </div>
    );
  }

  if (!stakeholder) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20, color: "#374151" }}>
        <Navbar />
        {t("engagementJustification.notFound")}
      </div>
    );
  }

  const getTranslatedType = (typeData) => {
    if (!typeData) return "-";
    const name = typeof typeData === "string" ? typeData : typeData.name;
    if (!name) return "-";
    const trimmed = name.trim();
    return t(`dashboard.card.types.${trimmed}`, trimmed);
  };

  const getTranslatedRole = (roleData) => {
    if (!roleData) return "-";
    const name = typeof roleData === "string" ? roleData : roleData.name;
    if (!name) return "-";
    const trimmed = name.trim();
    return t(`dashboard.card.roles.${trimmed}`, trimmed);
  };

  const formatLevel = (level) => {
    if (!level) return "-";
    const normalized = level.trim().toLowerCase();
    if (normalized === "high") return t("common.high", "Tinggi");
    if (normalized === "medium") return t("common.medium", "Sedang");
    if (normalized === "low") return t("common.low", "Rendah");
    if (normalized === "very high" || normalized === "very_high") return t("engagementPriority.intensities.Very High", "Sangat Tinggi");
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          fontFamily: "SF Pro Display, sans-serif",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          padding: 5,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            padding: "85px 50px 30px",
            height: "100vh",
            boxSizing: "border-box",
          }}
        >
          {/* Left Panel */}
          <div
            style={{
              background: 'url("/images/bgr.png")',
              backgroundSize: "cover",
              borderRadius: 24,
              padding: 20,
              color: "black",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <img
                src="/icons/profile.png"
                alt="profile"
                style={{ width: 100, height: 100, borderRadius: "50%", padding: 10, flexShrink: 0 }}
              />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h2 style={{ fontSize: 28, fontWeight: "bold", color: "white", margin: 0, lineHeight: 1.2 }}>
                  {stakeholder.name}
                </h2>
                <p style={{ fontSize: 15, color: "white", margin: "6px 0 0 0", lineHeight: 1.3, textAlign: "left" }}>
                  {getTranslatedRole(stakeholder.role)}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              {["Location", "Contact"].map((label) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    padding: 3,
                    borderRadius: 16,
                    background: "linear-gradient(to right, #6C6DCB, #204C92)",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: 16,
                      padding: "12px 18px",
                      fontWeight: "bold",
                      color: "#1E3A8A",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 13 }}>
                      {label === "Location" ? t("engagementJustification.fields.location") : t("engagementJustification.fields.contact")}
                    </span>
                    <div style={{ marginTop: 2, color: "#1E3A8A", fontSize: 14 }}>
                      {label === "Location"
                        ? stakeholder.location?.city || stakeholder.location?.province?.name || "-"
                        : stakeholder.contact || "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {[
              { label: t("engagementJustification.fields.stakeholderType"), value: getTranslatedType(stakeholder.stakeholderType), bg: "#E9F7DF", color: "#065f46" },
              { label: t("engagementJustification.fields.engagementCategory"), value: stakeholder.engagementCategory ? t(`dashboard.card.categories.${stakeholder.engagementCategory}`, stakeholder.engagementCategory) : "-", bg: "#D2E3EB", color: "#374151" },
              { label: t("engagementJustification.fields.influenceLevel"), value: formatLevel(stakeholder.influenceLevel), bg: "#EDE9FE", color: "#4C1D95" },
              { label: t("engagementJustification.fields.interestLevel"), value: formatLevel(stakeholder.interestLevel), bg: "#FEF3C7", color: "#78350F" },
            ].map(({ label, value, bg, color }) => (
              <div
                key={label}
                style={{
                  padding: 3,
                  borderRadius: 16,
                  background: "linear-gradient(to right, #6C6DCB, #204C92)",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "14px 20px",
                    borderRadius: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{label}:</div>
                  <div
                    style={{
                      backgroundColor: bg,
                      boxShadow: "0 4px 6px 4px rgba(0,0,0,0.2)",
                      color,
                      padding: "5px 20px",
                      borderRadius: 12,
                      minWidth: 140,
                      textAlign: "center",
                    }}
                  >
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel */}
          <div
            style={{
              background: 'url("/images/backgroundright.png")',
              backgroundSize: "cover",
              borderRadius: 24,
              padding: 28,
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              {t("engagementJustification.title")}
              <img
                src="/icons/Information.png"
                alt="Info"
                style={{ width: 20, height: 20, objectFit: "contain" }}
              />
            </h3>

            <div
              style={{
                flex: 1,
                padding: 3,
                borderRadius: 16,
                background: "linear-gradient(to right, #6C6DCB, #04265eff)",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.85), rgba(255,255,255,0.95))",
                  color: "#1e293b",
                  padding: "20px 24px",
                  borderRadius: 12,
                  fontWeight: "500",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  height: "100%",
                  overflowY: "auto",
                  lineHeight: 1.9,
                  boxSizing: "border-box",
                }}
              >
                {stakeholder.justification ? (
                  <ol style={{ paddingLeft: 20, margin: 0 }}>
                    {formatJustification(
                      typeof stakeholder.justification === "string"
                        ? stakeholder.justification
                        : JSON.stringify(stakeholder.justification)
                    ).map((item, index) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: 12,
                          paddingBottom: 12,
                          borderBottom: index < formatJustification(typeof stakeholder.justification === "string" ? stakeholder.justification : JSON.stringify(stakeholder.justification)).length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                          fontSize: 14,
                        }}
                      >
                        {translateJustificationItem(item, i18n.language)}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div style={{ textAlign: "center", color: "#6b7280", fontStyle: "italic", marginTop: 40, fontSize: 15 }}>
                    {t("engagementJustification.noData")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
