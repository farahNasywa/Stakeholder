import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import StakeholderAutocomplete from "../components/StakeholderAutocomplete";
import api from "../utils/api";

export default function StakeholderProfileSetup() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [stakeholder, setStakeholder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [stakeholderName, setStakeholderName] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedRelevance, setSelectedRelevance] = useState("");
    const [stakeholderTypes, setStakeholderTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("");

    const [roles, setRoles] = useState([]);
    const [categories] = useState(["Primary", "Secondary", "Tertiary"]);
    const [relevanceOptions] = useState(["High", "Medium", "Low"]);
    const [status, setStatus] = useState({
        authority: false,
        influence: false,
        interest: false,
        impactedbyproject: false,
        dependency: false,
        alignment: false,
        opportunity: false,
        risk: false,
        benefit: false,
        category: false,
    });
    const currentUser = localStorage.getItem("name") || "anonymous";
    const [isUpdatingData, setIsUpdatingData] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isFormSaved, setIsFormSaved] = useState(false);

    // Tambahkan ini
    const [assessmentUnlocked, setAssessmentUnlocked] = useState(
        () => JSON.parse(localStorage.getItem("assessmentUnlocked")) || false
    );


    useEffect(() => {
        const loadFormFromStorage = () => {
            try {
                const savedForm = localStorage.getItem('stakeholder-form-data');
                if (savedForm) {
                    const formData = JSON.parse(savedForm);
                    setStakeholderName(formData.name || "");
                    setSelectedRole(formData.role || "");
                    setSelectedType(formData.type || "");
                    setSelectedCategory(String(formData.category || ""));
                    setSelectedRelevance(String(formData.relevance || ""));

                    setIsFormSaved(true);
                }
            } catch (err) {
                console.error("Error loading form from localStorage:", err);
            }
        };

        loadFormFromStorage();
    }, []);

    useEffect(() => {
        localStorage.setItem("assessmentUnlocked", JSON.stringify(assessmentUnlocked));
    }, [assessmentUnlocked]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [stakeholderRes, rolesRes, typesRes] = await Promise.all([
                    id ? api.get(`/api/stakeholders/${id}`) : Promise.resolve({ data: null }),
                    api.get("/api/roles"),
                    api.get("/api/stakeholder-types")
                ]);

                if (stakeholderRes.data) {
                    setStakeholder(stakeholderRes.data);

                    const savedFormRaw = localStorage.getItem('stakeholder-form-data');
                    const s = savedFormRaw ? JSON.parse(savedFormRaw) : {};

                    setStakeholderName(
                        (s.name ?? stakeholderRes.data.name) || ""
                    );
                    setSelectedRole(
                        (s.role ?? stakeholderRes.data.role?._id) || ""
                    );
                    setSelectedType(
                        (s.type ?? stakeholderRes.data.stakeholderType?._id) || ""   // <-- penting
                    );
                    setSelectedCategory(
                        (s.category ?? stakeholderRes.data.engagementCategory) || ""
                    );
                    setSelectedRelevance(
                        (s.relevance ?? stakeholderRes.data.relevance ?? stakeholderRes.data.engagementRelevance) || ""
                    );
                }

                setRoles(rolesRes.data);
                setStakeholderTypes(typesRes.data);
            } catch (err) {
                setError("Gagal memuat data. Pastikan server API berjalan.");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const keys = {
            authority: "cluster-authority",
            influence: "cluster-influence",
            interest: "cluster-interest",
            impactedbyproject: "cluster-impactedbyproject",
            dependency: "cluster-dependency",
            alignment: "cluster-alignment",
            opportunity: "cluster-opportunity",
            risk: "cluster-risk",
            benefit: "cluster-benefit",
            category: "cluster-category",
        };

        let newStatus = { ...status };

        Object.entries(keys).forEach(([key, storageKey]) => {
            try {
                const raw = localStorage.getItem(storageKey);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.completed) {
                        newStatus[key] = true;
                    }
                }
            } catch (err) {
                console.error(`Error parsing ${storageKey}:`, err);
            }
        });

        setStatus(newStatus);
    }, []);

    const allAssessmentsCompleted = Object.values(status).every(completed => completed === true);

    useEffect(() => {
        if (allAssessmentsCompleted) {
            try {
                const authorityData = JSON.parse(localStorage.getItem("cluster-authority") || "{}");
                const influenceData = JSON.parse(localStorage.getItem("cluster-influence") || "{}");
                const interestData = JSON.parse(localStorage.getItem("cluster-interest") || "{}");
                const impactedData = JSON.parse(localStorage.getItem("cluster-impactedbyproject") || "{}");
                const dependencyData = JSON.parse(localStorage.getItem("cluster-dependency") || "{}");
                const alignmentData = JSON.parse(localStorage.getItem("cluster-alignment") || "{}");
                const opportunityData = JSON.parse(localStorage.getItem("cluster-opportunity") || "{}");
                const riskData = JSON.parse(localStorage.getItem("cluster-risk") || "{}");
                const benefitData = JSON.parse(localStorage.getItem("cluster-benefit") || "{}");
                const categoryData = JSON.parse(localStorage.getItem("cluster-category") || "{}");

                const scoring = (val) => {
                    if (val === "High") return 3;
                    if (val === "Medium") return 2;
                    if (val === "Low") return 1;
                    return 0;
                };

                const totalScore =
                    scoring(authorityData.value) +
                    scoring(influenceData.value) +
                    scoring(interestData.value) +
                    scoring(impactedData.value) +
                    scoring(dependencyData.value) +
                    scoring(alignmentData.value) +
                    scoring(opportunityData.value) +
                    scoring(riskData.value) +
                    scoring(benefitData.value) +
                    scoring(categoryData.value);

                let newCategory = "";
                let newRelevance = "";

                if (totalScore >= 24) {
                    newCategory = "Primary";
                    newRelevance = "High";
                } else if (totalScore >= 18) {
                    newCategory = "Secondary";
                    newRelevance = "Medium";
                } else {
                    newCategory = "Tertiary";
                    newRelevance = "Low";
                }

                setSelectedCategory(newCategory);
                setSelectedRelevance(newRelevance);

                saveFormToStorage(stakeholderName, selectedRole, selectedType, newCategory, newRelevance);
            } catch (err) {
                console.error("Error auto-updating category & relevance:", err);
            }
        } else {
            // 🚀 kalau belum complete semua cluster, kosongkan field
            setSelectedCategory("");
            setSelectedRelevance("");
        }
    }, [allAssessmentsCompleted]);


    const isProfileComplete =
        stakeholderName.trim() !== "" && selectedRole !== "" && selectedType !== "";

    const saveFormToStorage = (name, role, type, category, relevance) => {
        const formData = {
            name,
            role,
            type,
            category,
            relevance,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('stakeholder-form-data', JSON.stringify(formData));
    };

    const saveClusterToLocalStorage = (clusterKey, data) => {
        try {
            localStorage.setItem(clusterKey, JSON.stringify(data));
            console.log(`Clustering results saved for ${clusterKey}`);
        } catch (err) {
            console.error("Error saving clustering results:", err);
        }
    };

    const saveToGoogleSheets = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            const spreadsheetId = "1GV3WqppPH0kvUrLA0zrXfqawAsCM5RhnB_Yp_fVE44Q";

            let roleName = formData.role;
            const foundRole = roles.find(r => r._id === formData.role);
            if (foundRole) {
                roleName = foundRole.name;
            }
            const payload = {
                formData: {
                    name: formData.name,
                    role: roleName,
                    category: formData.engagementCategory,     // isi ke E90
                    relevance: formData.engagementRelevance,  // isi ke D86
                }
            };


            const res = await api.post(
                `/sheets/${spreadsheetId}/save-form`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Data stakeholder berhasil disimpan ke Google Sheets:", res.data);
            return true;
        } catch (err) {
            console.error("Error saving to Google Sheets:", err);
            return false;
        }
    };

    const handleSaveStakeholder = async () => {
        if (!stakeholderName.trim()) {
            alert("Nama stakeholder harus diisi!");
            return;
        }
        try {
            setIsUpdatingData(true);

            const formData = {
                name: stakeholderName,
                role: selectedRole,
                createdBy: currentUser,
                updatedBy: currentUser,
                stakeholderType: selectedType,
                engagementCategory: selectedCategory,
                engagementRelevance: selectedRelevance, // Use the correct field name
                timestamp: new Date().toISOString()
            };

            saveFormToStorage(
                stakeholderName,
                selectedRole,
                selectedType,
                selectedCategory,
                selectedRelevance
            );

            const googleSheetsSuccess = await saveToGoogleSheets(formData);
            if (!googleSheetsSuccess) {
                console.warn("Failed to save to Google Sheets, but continuing with database save");
            }

            const token = localStorage.getItem("token");

            // Get levels from Google Sheets (opsional, tidak blokir save)
            let sheetsData = {};
            try {
                const res = await api.get(`/sheets/1GV3WqppPH0kvUrLA0zrXfqawAsCM5RhnB_Yp_fVE44Q/levels`);
                console.log("Levels dari sheet:", res.data.data);
                sheetsData = res.data.data || {};
            } catch (sheetsErr) {
                console.warn("Google Sheets levels gagal diambil, pakai default:", sheetsErr);
            }

            const payload = {
                ...formData,
                // Map Google Sheets fields to model field names
                influenceLevel: sheetsData.influence || sheetsData.influenceLevel || "medium",
                interestLevel: sheetsData.interest || sheetsData.interestLevel || "medium",
                riskLevel: sheetsData.riskLevel || sheetsData.risk || "medium",
                opportunityLevel: sheetsData.opportunity || sheetsData.opportunityLevel || "medium",
                benefitLevel: sheetsData.benefit || sheetsData.benefitLevel || "high",
            };

            console.log("Final payload:", payload);

            let response;
            if (id) {
                response = await api.put(
                    `/api/stakeholders/${id}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                response = await api.post(
                    "/api/stakeholders",
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            if (response.status === 200 || response.status === 201) {
                setStakeholder(response.data);
                setIsFormSaved(true);
                // clearAllLocalStorage();
                setShowSuccessPopup(true);
                try {
                    await api.post(
                        `/sheets/1GV3WqppPH0kvUrLA0zrXfqawAsCM5RhnB_Yp_fVE44Q/save-justification`,
                        { stakeholderId: response.data._id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("Justification berhasil disimpan ke DB");
                } catch (err) {
                    console.error("Gagal menyimpan justification:", err);
                }
                navigate(`/engagementjustification/${response.data._id}`, { replace: true });
            }
        } catch (error) {
            console.error("Error saving stakeholder:", error);

            if (error.response) {
                console.error("Server Error:", error.response.data);
            } else if (error.request) {
                alert("Network error. Please check your connection and try again.");
            } else {
                alert("Gagal menyimpan data stakeholder. Silakan coba lagi.");
            }
        } finally {
            setIsUpdatingData(false);
        }
    };

    const saveClusteringResults = async () => {
        try {
            setIsUpdatingData(true);
            const token = localStorage.getItem("token");
            const spreadsheetId = "1GV3WqppPH0kvUrLA0zrXfqawAsCM5RhnB_Yp_fVE44Q";

            let stakeholderId = stakeholder?._id;

            // 🚀 Kalau belum ada ID → buat dulu
            if (!stakeholderId) {
                console.log("Belum ada _id, simpan stakeholder dulu...");
                await handleSaveStakeholder();

                // Ambil lagi stakeholder terbaru setelah disimpan
                const savedForm = JSON.parse(localStorage.getItem("stakeholder-form-data") || "{}");
                const res = await api.get(`/api/stakeholders?name=${savedForm.name}`);
                if (res.data && res.data.length > 0) {
                    stakeholderId = res.data[0]._id;
                    setStakeholder(res.data[0]);
                }
            }

            if (!stakeholderId) {
                alert("Stakeholder tetap tidak ditemukan setelah save!");
                return;
            }

            // Google Sheets opsional
            try {
                await api.post(
                    `/sheets/${spreadsheetId}/save-justification`,
                    { stakeholderId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (sheetsError) {
                console.warn("Google Sheets gagal, lanjut navigasi:", sheetsError);
            }

            setShowSuccessPopup(true);

            setTimeout(() => {
                navigate(`/engagementjustification/${stakeholderId}`);
            }, 1500);

        } catch (error) {
            console.error("Error saving clustering results:", error);
        } finally {
            setIsUpdatingData(false);
        }
    };


    // Handle form input changes with localStorage save
    const handleNameChange = (e) => {
        const value = e.target.value;
        setStakeholderName(value);
        setAssessmentUnlocked(false);
        saveFormToStorage(value, selectedRole, selectedType, selectedCategory, selectedRelevance);
    };

    // Handle stakeholder selection from autocomplete
    const handleStakeholderSelect = (suggestion) => {
        setStakeholderName(suggestion.name);
        if (suggestion.role?._id) {
            setSelectedRole(suggestion.role._id);
        }
        if (suggestion.stakeholderType?._id) {
            setSelectedType(suggestion.stakeholderType._id);
        }
        setAssessmentUnlocked(false);
        saveFormToStorage(
            suggestion.name, 
            suggestion.role?._id || selectedRole, 
            suggestion.stakeholderType?._id || selectedType, 
            selectedCategory, 
            selectedRelevance
        );
    };

    const handleRoleChange = (e) => {
        const value = e.target.value;
        setSelectedRole(value);
        setAssessmentUnlocked(false);
        saveFormToStorage(stakeholderName, value, selectedType, selectedCategory, selectedRelevance);
    };

    const handleTypeChange = (e) => {
        const value = e.target.value;
        setSelectedType(value);
        setAssessmentUnlocked(false);
        saveFormToStorage(stakeholderName, selectedRole, value, selectedCategory, selectedRelevance);
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        saveFormToStorage(stakeholderName, selectedRole, selectedType, value, selectedRelevance);
    };

    const handleRelevanceChange = (e) => {
        const value = e.target.value;
        setSelectedRelevance(value);
        saveFormToStorage(stakeholderName, selectedRole, selectedType, selectedCategory, value);
    };

    useEffect(() => {
        let timer;
        if (showSuccessPopup) {
            timer = setTimeout(() => {
                setShowSuccessPopup(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showSuccessPopup]);

    const renderLink = (key, path, index) => {
        const clusterOrder = [
            "authority",
            "influence",
            "interest",
            "impactedbyproject",
            "dependency",
            "alignment",
            "opportunity",
            "risk",
            "benefit",
            "category"
        ];

        const assessmentPath = stakeholder?._id ? `${path}/${stakeholder._id}` : path;

        // Jika biodata belum lengkap, semua kartu tidak bisa diakses
        // Jika biodata belum lengkap atau tombol biru belum diklik → disable cluster
        // Jika biodata belum lengkap atau belum klik tombol biru → disable semua cluster
        // Jika biodata belum lengkap atau tombol biru belum diklik → disable cluster
        if (!isProfileComplete || !assessmentUnlocked) {
            return (
                <button
                    disabled
                    className="text-white bg-gray-400 rounded-lg p-2 font-medium cursor-not-allowed"
                >
                    Complete the Assessment First
                </button>
            );
        }



        if (!assessmentUnlocked) {
            return (
                <button
                    disabled
                    className="text-white bg-gray-400 rounded-lg p-2 font-medium cursor-not-allowed"
                >
                    Complete the Assessment First
                </button>
            );
        }

        // Untuk klaster pertama (index 0) - langsung bisa diakses jika biodata lengkap
        if (index === 0) {
            return status[key] ? (
                <Link
                    to={assessmentPath}
                    className="text-white bg-green-500 rounded-lg p-2 font-medium"
                >
                    Complete
                </Link>
            ) : (
                <Link
                    to={assessmentPath}
                    className="text-white bg-red-500 rounded-lg p-2 font-medium"
                >
                    Complate the Assessment!
                </Link>
            );
        }

        // Untuk klaster selanjutnya (index > 0)
        const prevKey = clusterOrder[index - 1];

        // Cek apakah klaster sebelumnya sudah selesai
        if (!status[prevKey]) {
            return (
                <button
                    disabled
                    className="text-white bg-gray-400 rounded-lg p-2 font-medium cursor-not-allowed"
                >
                    Complate the previous Assessment
                </button>
            );
        }

        // Jika klaster sebelumnya sudah selesai, bisa akses klaster ini
        return status[key] ? (
            <Link
                to={assessmentPath}
                className="text-white bg-green-500 rounded-lg p-2 font-medium"
            >
                Complete
            </Link>
        ) : (
            <Link
                to={assessmentPath}
                className="text-white bg-red-500 rounded-lg p-2 font-medium"
            >
                Complate the Assessment!
            </Link>
        );
    };

    const clearAllLocalStorage = () => {
        try {
            localStorage.removeItem('stakeholder-form-data');

            const clusteringKeys = [
                'cluster-authority',
                'cluster-influence',
                'cluster-interest',
                'cluster-impactedbyproject',
                'cluster-dependency',
                'cluster-alignment',
                'cluster-opportunity',
                'cluster-risk',
                'cluster-benefit',
                'cluster-category',
                'stakeholder-form-data'
            ];

            clusteringKeys.forEach(key => {
                localStorage.removeItem(key);
            });

            setStatus({
                authority: false,
                influence: false,
                interest: false,
                impactedbyproject: false,
                dependency: false,
                alignment: false,
                opportunity: false,
                risk: false,
                benefit: false,
                category: false,
            });

            setIsFormSaved(false);

            console.log("LocalStorage berhasil dibersihkan");

        } catch (error) {
            console.error("Error clearing localStorage:", error);
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-2xl text-gray-600">
                <Navbar />
                Loading...
            </div>
        );
    }

    return (
        <div className="">
            <Navbar />

            <div className="mt-20 flex gap-10">
                <section
                    style={{ backgroundImage: "url('/images/bgnew.jpg')" }}
                    className="flex-1 m-5 p-4 rounded-xl flex flex-col gap-5"
                >
                    <div>
                        <h1 className="text-white font-bold text-xl">Overview</h1>
                        <p className="text-white">
                            Collects and manages stakeholder information to support effective coordination, communication, and decision making.
                        </p>
                    </div>

                    <div>
                        <h1 className="text-white font-bold text-xl">Objective</h1>
                        <p className="text-white">
                            The objective of this page is to collect and manage stakeholder profile information systematically to support effective communication, personalized services, and data-driven decision making.
                        </p>
                    </div>

                    <div>
                        <h1 className="mb-2 text-white font-semibold text-lg">
                            Stakeholder Name
                            {isFormSaved && <span className="ml-2 text-green-400 text-sm">(Saved ✓)</span>}
                        </h1>
                        <StakeholderAutocomplete
                            value={stakeholderName}
                            onChange={handleNameChange}
                            onSelect={handleStakeholderSelect}
                            placeholder="Type Name of Stakeholder (suggestions will appear)"
                        />
                    </div>

                    <div>
                        <h1 className="mb-2 font-semibold text-lg text-white">Stakeholder Roles</h1>
                        <div className="relative w-full">
                            <select
                                className="w-full h-12 rounded-lg border-2 border-gray-400 shadow px-4 font-semibold text-black bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedRole}
                                onChange={handleRoleChange}
                            >
                                <option value="">Select Role</option>
                                {roles.map((role) => (
                                    <option key={role._id} value={role._id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>

                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-blue-900 font-bold"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="mb-2 font-semibold text-lg text-white">Stakeholder Type</h1>
                        <div className="relative w-full">
                            <select
                                className="w-full h-12 rounded-lg border-2 border-gray-400 shadow px-4 font-semibold text-black bg-white"
                                value={selectedType}
                                onChange={handleTypeChange}
                            >
                                <option value="">Select Stakeholder Type</option>
                                {stakeholderTypes.map((type) => (
                                    <option key={type._id} value={type._id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="flex-1">
                            <h1 className="mb-2 font-semibold text-lg text-white">Category</h1>
                            <input
                                type="text"
                                value={selectedCategory || ""}
                                readOnly
                                disabled={!allAssessmentsCompleted}   // 🚀 kunci disini
                                className={`w-full h-12 rounded-lg border-2 shadow px-4 font-semibold text-black 
        ${allAssessmentsCompleted
                                        ? "border-gray-400 bg-gray-100"
                                        : "border-gray-300 bg-gray-300 cursor-not-allowed"
                                    }`}
                            />
                        </div>

                        <div className="flex-1">
                            <h1 className="mb-2 font-semibold text-lg text-white">Relevance</h1>
                            <input
                                type="text"
                                value={selectedRelevance || ""}
                                readOnly
                                disabled={!allAssessmentsCompleted}   // 🚀 kunci disini
                                className={`w-full h-12 rounded-lg border-2 shadow px-4 font-semibold text-black 
        ${allAssessmentsCompleted
                                        ? "border-gray-400 bg-gray-100"
                                        : "border-gray-300 bg-gray-300 cursor-not-allowed"
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Save Stakeholder Button */}

                    <button
                        onClick={async () => {
                            await handleSaveStakeholder();   
                            setAssessmentUnlocked(true);     
                        }}
                        disabled={!isProfileComplete || isUpdatingData}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${!isProfileComplete || isUpdatingData
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg"
                            }`}
                    >
                        {isUpdatingData
                            ? "Menyimpan..."
                            : (id ? "Update Stakeholder Profile" : "Complete the Assessment First")}
                    </button>

                    <div className="mt-2">
                        <button
                            onClick={saveClusteringResults}
                            disabled={isUpdatingData || !allAssessmentsCompleted}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${isUpdatingData || !allAssessmentsCompleted
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 shadow-lg'
                                }`}
                        >
                            {isUpdatingData ? "Processing..." : "Save All Data & Assessment"}
                        </button>
                    </div>
                </section>

                {/* Analysis Section */}
                <section
                    style={{ backgroundImage: "url('/images/bgnew.jpg')" }}
                    className="flex-1 m-5 p-4 rounded-xl flex flex-col gap-4"
                >
                    <div className="mb-4">
                        <h2 className="text-white font-bold text-xl mb-2">Assessment Clusters</h2>
                        <p className="text-white text-sm">
                            Complete all assessments to generate stakeholder justification
                        </p>
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg shadow p-3">
                        <span className="font-medium">Authority / Legitimasi</span>
                        {renderLink("authority", "/cluster/authority", 0)}
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg shadow p-3">
                        <span className="font-medium">Influence on Project</span>
                        {renderLink("influence", "/cluster/influence", 1)}
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg shadow p-3">
                        <span className="font-medium">Interest</span>
                        {renderLink("interest", "/cluster/interest", 2)}
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg shadow p-3">
                        <span className="font-medium">Impacted by Project</span>
                        {renderLink("impactedbyproject", "/cluster/impactedbyproject", 3)}
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg shadow p-3">
                        <span className="font-medium">Dependency</span>
                        {renderLink("dependency", "/cluster/dependency", 4)}
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg shadow p-3">
                        <span className="font-medium">Alignment / Policy Role</span>
                        {renderLink("alignment", "/cluster/alignment", 5)}
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg shadow p-3">
                        <span className="font-medium">Opportunity Potential</span>
                        {renderLink("opportunity", "/cluster/opportunity", 6)}
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg shadow p-3">
                        <span className="font-medium">Risk Potential</span>
                        {renderLink("risk", "/cluster/risk", 7)}
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg shadow p-3">
                        <span className="font-medium">Benefit Analysis</span>
                        {renderLink("benefit", "/cluster/benefit", 8)}
                    </div>

                    <div className="flex justify-between items-center bg-white rounded-lg shadow p-3">
                        <span className="font-medium">Category</span>
                        {renderLink("category", "/cluster/category", 9)}
                    </div>

                    {allAssessmentsCompleted && stakeholder && isFormSaved && (
                        <button
                            onClick={saveClusteringResults}
                            disabled={isUpdatingData}
                            className={`mt-6 py-4 rounded-lg font-bold text-white text-lg transition-all duration-200 ${isUpdatingData
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transform hover:scale-105'
                                }`}
                        >
                            {isUpdatingData ? "Processing..." : "🎉 Complete & Generate Justification"}
                        </button>
                    )}

                </section>
            </div >
            {/* Success Popup */}
            {
                showSuccessPopup && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl z-50 flex flex-col items-center gap-4">
                        <img
                            src="/icons/success_check.png"
                            alt="Success"
                            className="w-12 h-12"
                        />
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-800">Success!</h3>
                            <p className="text-gray-600">
                                {allAssessmentsCompleted
                                    ? "Clustering results saved! All data cleared. Redirecting to justification page..."
                                    : "Stakeholder data saved to database, Google Sheets, and localStorage!"
                                }
                            </p>
                        </div>
                    </div>
                )
            }

            {
                error && (
                    <div className="fixed top-20 right-5 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
                        {error}
                    </div>
                )
            }
        </div >
    );
}