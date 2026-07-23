import { useState, useEffect } from "react";

/**
 * useStakeholderForm
 *
 * Logika form Stakeholder yang dipakai bersama oleh EditStakeholderModal
 * (mode edit) dan AddStakeholderPage (mode tambah): state form, normalisasi
 * data awal (level huruf kecil, ObjectId untuk dropdown), serta cascading
 * Province -> City -> District. Satu sumber logika supaya perilaku kedua
 * form selalu identik.
 *
 * @param {object|null} initialData - data awal untuk mode edit; null/undefined untuk mode tambah
 * @param {array} locations - daftar provinsi beserta cities/districts dari API
 */
export default function useStakeholderForm(initialData, locations = []) {
  const [form, setForm] = useState({});
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const initialForm = {
      name: initialData?.name || "",
      contact: initialData?.contact || "",
      role: initialData?.role?._id || initialData?.role || "",
      stakeholderType:
        initialData?.stakeholderType?._id || initialData?.stakeholderType || "",
      engagementCategory: initialData?.engagementCategory || "",
      engagementFrequency:
        initialData?.engagementFrequency?._id ||
        initialData?.engagementFrequency ||
        "",
      engagementStrategy:
        initialData?.engagementStrategy?._id ||
        initialData?.engagementStrategy ||
        "",
      influence:
        (initialData?.influence || initialData?.influenceLevel)?.toLowerCase() || "",
      interest:
        (initialData?.interest || initialData?.interestLevel)?.toLowerCase() || "",
      riskLevel: initialData?.riskLevel?.toLowerCase() || "",
      opportunity:
        (initialData?.opportunity || initialData?.opportunityLevel)?.toLowerCase() ||
        "",
      benefit: (initialData?.benefit || initialData?.benefitLevel)?.toLowerCase() || "",
      status: initialData?.status || "Pending",
      location: {
        province: initialData?.location?.province?._id || initialData?.location?.province || "",
        city: initialData?.location?.city || "",
        district: initialData?.location?.district || "",
      },
    };

    setForm(initialForm);

    const initialProvince = locations.find(
      (loc) => loc._id === initialForm.location.province
    );
    setSelectedProvince(initialProvince || null);

    if (initialProvince && initialForm.location.city) {
      const initialCity = initialProvince.cities?.find(
        (city) => city.name === initialForm.location.city
      );
      setSelectedCity(initialCity || null);
    } else {
      setSelectedCity(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, locations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    const provinceObject = locations.find((loc) => loc._id === provinceId);

    setForm((prev) => ({
      ...prev,
      location: {
        province: provinceId,
        city: "",
        district: "",
      },
    }));
    setSelectedProvince(provinceObject || null);
    setSelectedCity(null);
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const cityObject = selectedProvince?.cities?.find(
      (city) => city.name === cityName
    );

    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        city: cityName,
        district: "",
      },
    }));
    setSelectedCity(cityObject || null);
  };

  const resetForm = () => {
    setForm({
      name: "",
      contact: "",
      role: "",
      stakeholderType: "",
      engagementCategory: "",
      engagementFrequency: "",
      engagementStrategy: "",
      influence: "",
      interest: "",
      riskLevel: "",
      opportunity: "",
      benefit: "",
      status: "Pending",
      location: { province: "", city: "", district: "" },
    });
    setSelectedProvince(null);
    setSelectedCity(null);
  };

  return {
    form,
    setForm,
    selectedProvince,
    selectedCity,
    handleChange,
    handleProvinceChange,
    handleCityChange,
    resetForm,
  };
}
