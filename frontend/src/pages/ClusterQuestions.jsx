import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const questions = {
  authority: {
    "Upstream Oil and Gas and Energy Regulation & Licensing": [
      "Apakah stakeholder ini mengatur, menerbitkan, mengelola, dan menarik regulasi serta perizinan di sektor usaha hulu migas dan energi?",
      "Apakah stakeholder ini menetapkan kebijakan teknis dan standar keselamatan di sektor tersebut?",
      "Apakah stakeholder ini mengelola tata ruang dan peraturan kawasan khusus terkait energi dan migas?"
    ],
    "Supervision, Compliance, and Law Enforcement": [
      "Apakah stakeholder ini mengaudit keuangan dan pelaksanaan kegiatan hulu migas?",
      "Apakah stakeholder ini mengelola perizinan investasi, fasilitasi investasi, dan pengawasan investasi di sektor hulu migas?",
      "Apakah stakeholder ini bertanggung jawab dalam penegakan hukum, penyidikan, dan penyelesaian sengketa terkait sektor ini?"
    ],
    "Investment, Financing, and Asset Management": [
      "Apakah stakeholder ini mengelola perizinan investasi, fasilitasi investasi, dan pengawasan investasi di sektor hulu migas?",
      "Apakah stakeholder ini bertanggung jawab atas alokasi dana proyek, pengawasan anggaran, serta audit fiskal dan keuangan?",
      "Apakah stakeholder ini mengelola kepemilikan Participating Interest (PI) dan kemitraan BUMD?"
    ],
    "Security and Protection of Strategic Assets": [
      "Apakah stakeholder ini mengatur dan mengawasi keamanan fasilitas migas dan aset strategis terkait?",
      "Apakah stakeholder ini melakukan koordinasi keamanan wilayah dan patroli rutin?"
    ],
    "Communication, Partnerships, and Social Responsibility": [
      "Apakah stakeholder ini mengelola komunikasi, koordinasi dengan masyarakat, pelaksanaan program CSR, dan resolusi konflik sosial di wilayah kerja?"
    ],
    "Energy Transition and Sustainable Policy": [
      "Apakah stakeholder ini bertanggung jawab dalam pengawasan energi terbarukan, integrasi transisi energi ke net-zero, dan pengembangan kebijakan energi berkelanjutan?",
      "Apakah stakeholder ini mengelola regulasi terkait perubahan iklim, emisi karbon, dan tata kelola dekarbonisasi sektor energi?",
    ],
    "Regional Policy and Government Synchronization": [
      "Apakah stakeholder ini aktif melakukan lobi kebijakan di tingkat regional dan sinkronisasi kebijakan pusat-daerah?",
      "Apakah stakeholder ini terlibat dalam penyusunan atau pelaporan lampiran RPJMD dan berkoordinasi dengan DPRD Komisi Energi?",
      "Apakah stakeholder ini memfasilitasi forum dialog kebijakan dan advokasi aspirasi masyarakat?"
    ],
    "Local Project Supervision and Facilitation": [
      "Apakah stakeholder ini mengawasi proyek energi dan migas di tingkat lokal dan daerah?",
      "Apakah stakeholder ini melakukan pengawasan fiskal, APBN/APBD, serta implementasi kebijakan di sektor energi?",
      "Apakah stakeholder ini memfasilitasi investasi daerah dan pengelolaan investasi migas?"
    ],
    "Technical Standards and Industry Practices": [
      "Apakah stakeholder ini menetapkan atau mengawasi standar teknis seperti gas pipeline dan integritas jaringan?",
      "Apakah stakeholder ini mendukung pelatihan nasional dan penyebaran praktik terbaik di industri energi?"
    ],
    "Oversight and Investigation": [
      "Apakah stakeholder ini melakukan investigasi di sektor migas dan pelaporan lifting?",
      "Apakah stakeholder ini mengawasi pelaksanaan kebijakan perizinan dan menangani pelanggaran lingkungan?",
      "Apakah stakeholder ini mengawasi CSR dan resolusi konflik sosial di tingkat lokal?"
    ],
    "Advocacy and Public Participation": [
      "Apakah stakeholder ini berperan dalam advokasi masyarakat adat dan perlindungan hak atas tanah?",
      "Apakah stakeholder ini memfasilitasi konsultasi AMDAL dan dialog publik terkait dampak sosial dan lingkungan?",
      "Apakah stakeholder ini melakukan atau terlibat dalam pendidikan masyarakat pra dan pasca eksplorasi dan mediasi sengketa sosial?"
    ],
    "Social and Environmental Coordination and Monitoring": [
      "Apakah stakeholder ini memfasilitasi forum koordinasi teknis lintas sektor dan melakukan audit CSR?",
      "Apakah stakeholder ini memantau dampak sosial dan integrasi program pembangunan melalui musrenbang dan advokasi pemangku kepentingan?",
      "Apakah stakeholder ini melakukan verifikasi sosial-lingkungan dan transparansi fiskal migas?"
    ]
  },
  influence: {
    "Stakeholders with Formal Authority": [
      "Apakah stakeholder ini memiliki kewenangan formal dalam pengaturan, perizinan, pengawasan teknis, dan pelaksanaan kebijakan sektor migas?",
      "Apakah stakeholder ini memiliki kekuatan legal atau administratif yang dapat menentukan kelangsungan proyek?"
    ],
    "Regional Government": [
      "Apakah stakeholder ini memiliki peran dalam pengelolaan izin lokal dan pengawasan lingkungan proyek migas?",
      "Apakah stakeholder ini terlibat dalam koordinasi lintas sektor dan mendukung operasional proyek di wilayahnya?"
    ],
    "Community Leaders and Social Groups": [
      "Apakah stakeholder ini memiliki pengaruh dalam membentuk opini publik dan penerimaan masyarakat terhadap proyek?",
      "Apakah stakeholder ini berperan dalam mengelola potensi konflik sosial di sekitar wilayah proyek?"
    ],
    "Business Partner / Project Implementer": [
      "Apakah stakeholder ini mengelola perizinan investasi, fasilitasi investasi, dan pengawasan investasi di sektor hulu migas?",
      "Apakah stakeholder ini terlibat dalam pelaksanaan teknis proyek dan pemenuhan standar operasional?"
    ],
    "Financial Institutions and Investment Support Entities": [
      "Apakah stakeholder ini menyediakan pembiayaan proyek atau berperan dalam penilaian kelayakan finansial?",
      "Apakah stakeholder ini memiliki pengaruh terhadap keputusan investasi dalam proyek migas?"
    ],
    "Technical Advisory and Data Coordination Agency": [
      "Apakah stakeholder ini berperan sebagai penasihat teknis dan kebijakan untuk proyek migas?",
      "Apakah stakeholder ini menyediakan data, informasi, atau rekomendasi strategis untuk mendukung pelaksanaan proyek?",
      "Apakah stakeholder ini terlibat dalam koordinasi komunikasi antar lembaga terkait proyek?"
    ],
    "The Local Government as a Social Facilitator": [
      "Apakah stakeholder ini berperan sebagai fasilitator komunikasi dan program sosial di wilayah proyek?",
      "Apakah stakeholder ini memiliki pengaruh lokal dalam mendorong atau meNolak proyek secara sosial-politik?"
    ],
    "Community as Social Mediator": [
      "Apakah stakeholder ini menyampaikan aspirasi dan keluhan masyarakat terkait proyek?",
      "Apakah stakeholder ini terlibat dalam advokasi lingkungan di sekitar wilayah proyek?"
    ],
    "Business Partners as [role/function to be specified]": [
      "Apakah stakeholder ini juga berperan dalam menilai risiko dan melakukan pengawasan teknis terhadap proyek?"
    ],
    "Financial Institutions: Working Capital and Operational Input": [
      "Apakah stakeholder ini memberikan masukan operasional atau pembiayaan jangka pendek untuk proyek migas?",
      "Apakah stakeholder ini memfasilitasi investasi daerah dan pengelolaan investasi migas?"
    ]
  },
  interest: {
    "Government and Regulatory Authorities": [
      "Apakah pemerintah daerah memiliki kepentingan dalam proyek karena penerimaan pajak dan penciptaan lapangan kerja lokal?",
      "Apakah regulator utama bertanggung jawab terhadap pengawasan ketat dan kepatuhan operasional proyek?"
    ],
    "Investors & Capital Owners": [
      "Apakah pemegang saham utama memiliki kontrol penuh dan harapan atas keuntungan finansial dari proyek?",
      "Apakah investor institusi memiliki eksposur modal yang signifikan terhadap proyek?"
    ],
    "External Oversight & Balancing Bodies": [
      "Apakah stakeholder ini sebagai lembaga lingkungan memantau dampak proyek dan terlibat dalam kerja sama atau penolakan terhadap proyek?",
      "Apakah stakeholder ini sebagai aparat keamanan bertanggung jawab dalam melindungi fasilitas dan menjamin keamanan operasional proyek?"
    ],
    "Workforce & Direct Partners": [
      "Apakah stakeholder ini sebagai karyawan langsung proyek memperoleh pendapatan langsung dari proyek dan dapat menuntut keadilan atau kenaikan upah?",
      "Apakah stakeholder ini sebagai kontraktor utama proyek memiliki kendali besar melalui kontrak besar dan monopoli pekerjaan?",
      "Apakah stakeholder ini sebagai mitra strategis proyek menyediakan jasa penting dan memiliki peran dominan dalam pengembangan proyek?",
      "Apakah stakeholder ini sebagai pemasok utama bahan baku berperan strategis dalam menjaga kesinambungan pasokan dan layanan proyek?"
    ],
    "Local Communities & Social Groups": [
      "Apakah stakeholder ini sebagai penduduk lokal bergantung pada proyek migas untuk lapangan pekerjaan, program CSR, dan penguatan ekonomi lokal?",
      "Apakah stakeholder ini sebagai pemilik lahan terdampak berhak atas kompensasi langsung, dan dapat terlibat dalam negosiasi harga serta aksi penolakan terhadap proyek?",
      "Apakah stakeholder ini sebagai serikat pekerja memperjuangkan hak tenaga kerja lokal dan berperan dalam dominasi serapan kerja di proyek?",
      "Apakah stakeholder ini sebagai masyarakat adat terdampak oleh penggunaan lahan proyek dan terlibat dalam isu lingkungan serta kepatuhan norma adat?",
      "Apakah stakeholder ini sebagai konsumen lokal bergantung pada pasokan energi dari proyek dan memiliki perhatian terhadap harga energi dan kompensasi?"
    ],
    "Supporting Government & Regulators": [
      "Apakah stakeholder ini sebagai pemerintah pusat memiliki pengaruh dalam proyek melalui kebijakan energi nasional?",
      "Apakah stakeholder ini sebagai pemerintah daerah non-pengambil kebijakan langsung berperan dalam mendukung pelaksanaan proyek melalui regulasi dan program kegiatan?",
      "Apakah stakeholder ini sebagai regulator pendukung non-utama memiliki keterlibatan teknis atau administratif dalam proyek meskipun bukan pengawas utama?"
    ],
    "Consultants, Academics, & Professionals": [
      "Apakah stakeholder ini sebagai konsultan proyek memberikan nasihat teknis dan terlibat dalam pelaksanaan proyek dengan memperhatikan reputasi profesional?",
      "Apakah stakeholder ini sebagai akademisi atau peneliti proyek terlibat dalam analisis independen, evaluasi, atau kerja sama proyek?",
      "Apakah stakeholder ini sebagai organisasi profesi sektor migas menetapkan standar industri dan menawarkan program kerja sama dalam proyek?"
    ],
    "Media & Public Opinion": [
      "Apakah stakeholder ini sebagai media lokal meliput isu proyek migas dan berperan dalam pembentukan opini publik?",
      "Apakah stakeholder ini sebagai media sosial (influencer) memiliki pengaruh moderat dalam membentuk persepsi publik dan mendukung program proyek?"
    ],
    "Civil Organizations & Social NGOs": [
      "Apakah stakeholder ini sebagai organisasi lingkungan sosial yang tidak terdampak langsung terlibat dalam advokasi komunitas, kerja sama, atau pengawasan program proyek?",
      "Apakah stakeholder ini sebagai LSM yang memantau dampak sosial berperan dalam kerja sama, pengawasan sosial, atau akses data proyek?"
    ],
    "Business Partners & Supporting Services": [
      "Apakah stakeholder ini sebagai UKM pendukung berperan dalam kolaborasi pelaksanaan proyek dan memengaruhi opini publik lokal?",
      "Apakah stakeholder ini sebagai pemasok jasa pendukung (seperti logistik dan keamanan) terlibat dalam kegiatan operasional proyek?"
    ],
    "Customers & Financial Sector": [
      "Apakah stakeholder ini sebagai pelanggan industri menggunakan produk migas dari proyek dan bergantung pada kontinuitas pasokan?",
      "Apakah stakeholder ini sebagai lembaga keuangan memberikan pembiayaan atau dukungan kredit untuk pelaksanaan proyek?"
    ]
  },
  impactedbyproject: {
    "Government & Regulatory Authorities": [
      "Apakah stakeholder ini sebagai pemerintah daerah atau regulator utama memiliki tanggung jawab dalam penerbitan izin, pengawasan regulasi, serta penerapan kebijakan proyek?",
      "Apakah stakeholder ini terlibat dalam koordinasi proyek, pengelolaan risiko hukum, dan menjaga keselamatan operasional di wilayah proyek?",
      "Apakah stakeholder ini memiliki kepentingan terhadap pajak proyek, legitimasi sosial, serta keberlanjutan dan tanggung jawab sosial proyek?"
    ],
    "Local Communities & Indigenous Peoples": [
      "Apakah stakeholder ini sebagai masyarakat lokal atau komunitas adat terdampak oleh penggunaan lahan dan kerusakan sumber daya di sekitar proyek?",
      "Apakah stakeholder ini terdampak secara sosial, ekonomi, budaya, atau kesehatan akibat aktivitas proyek?",
      "Apakah stakeholder ini berperan dalam mengelola potensi konflik sosial di sekitar wilayah proyek?"
    ],
    "Landowners": [
      "Apakah stakeholder ini sebagai pemilik lahan terdampak memiliki hak atas kompensasi, negosiasi harga, dan perlindungan hukum terhadap kepemilikan lahan?",
      "Apakah stakeholder ini berpotensi mendukung atau menolak proyek berdasarkan perjanjian lahan, pengalihan hak, atau risiko sengketa?",
      "Apakah stakeholder ini terdampak oleh gangguan usaha dan memiliki kekhawatiran atas keamanan dan penahanan lahan?"
    ],
    "Workers & Labor Unions": [
      "Apakah stakeholder ini sebagai karyawan proyek atau serikat pekerja memiliki kepentingan dalam kondisi kerja, keselamatan, dan kepastian kerja?",
      "Apakah stakeholder ini dapat melakukan negosiasi, pemogokan, atau advokasi terhadap upah, jam kerja, dan hubungan industrial?",
      "Apakah stakeholder ini menyediakan data, informasi, atau rekomendasi strategis untuk mendukung pelaksanaan proyek?"
    ],
    "Investors & Capital Owners": [
      "Apakah stakeholder ini sebagai investor institusi memiliki kekhawatiran terhadap risiko reputasi, dampak finansial, dan kelangsungan investasi proyek?",
      "Apakah stakeholder ini memperhatikan kepatuhan terhadap regulasi, ROI (Return On Investment), serta transparansi proyek?",
      "Apakah stakeholder ini menilai kinerja proyek berdasarkan prinsip ESG (Environmental, Social, Governance) dan manajemen risiko?"
    ],
    "Main Contractors & Vendors": [
      "Apakah stakeholder ini memiliki ketergantungan pada proyek melalui kontrak kerja dan rantai pasok yang harus dipenuhi secara berkala?",
      "Apakah stakeholder ini terpengaruh oleh jadwal proyek, kualitas operasional, serta potensi negosiasi harga dan risiko keterlambatan?",
      "Apakah stakeholder ini perlu dilibatkan dalam koordinasi teknis, pelaporan kinerja, dan kepatuhan terhadap standar proyek?"
    ],
    "Sub-District Government": [
      "Apakah stakeholder ini berperan dalam mendukung pelaksanaan proyek melalui program lokal, izin operasional, dan penyuluhan kepada masyarakat?",
      "Apakah stakeholder ini memiliki tanggung jawab dalam membantu penyelesaian konflik sosial atau keluhan dari masyarakat sekitar proyek?",
      "Apakah stakeholder ini terlibat dalam pemantauan dampak proyek dan pengumpulan data untuk pelaporan atau kebijakan lokal?"
    ],
    "NGOs & Social NGOs": [
      "Apakah stakeholder ini fokus pada advokasi sosial dan lingkungan dengan memantau dampak proyek serta melakukan kampanye kesadaran publik?",
      "Apakah stakeholder ini memiliki kemampuan memicu opini publik, melakukan audit sosial, dan memberikan tekanan pada kepatuhan sosial proyek?",
      "Apakah stakeholder ini berpotensi menjadi mitra dalam dialog publik atau program CSR berbasis komunitas?"
    ],
    "Strategic Partners & Project Consultants": [
      "Apakah stakeholder ini mendukung proyek melalui konsultasi teknis, evaluasi, atau koordinasi lintas sektor?",
      "Apakah stakeholder ini berperan penting dalam mitigasi risiko dan penyesuaian rencana teknis selama siklus proyek?",
      "Apakah stakeholder ini terlibat dalam pengembangan kapasitas internal proyek melalui transfer teknologi dan audit kinerja?"
    ],
    "Surrounding Communities": [
      "Apakah stakeholder ini terdampak oleh gangguan aktivitas proyek seperti kemacetan, polusi, dan kebisingan di lingkungan sekitar?",
      "Apakah stakeholder ini memiliki harapan terhadap manfaat proyek seperti akses infrastruktur, peluang usaha, atau program sosial?",
      "Apakah stakeholder ini dapat terlibat dalam partisipasi sosial, komunikasi proyek, dan pengembangan komunitas lokal?"
    ]
  },
  dependency: {
    "Government & Regulatory Authorities": [
      "Apakah pemerintah daerah menerima pendapatan langsung atau alokasi dana yang signifikan dari proyek?",
      "Apakah pemerintah tergantung pada proyek untuk stabilitas ekonomi daerah?",
      "Apakah pemerintah/regulator memiliki kepentingan terhadap pajak proyek, legitimasi sosial, serta keberlanjutan dan tanggung jawab sosial proyek?"
    ],
    "Indigenous Peoples Groups & Local Communities": [
      "Apakah komunitas ini menerima manfaat layanan sosial seperti akses air, bahan bakar, dan bantuan dari proyek?",
      "Apakah mereka termasuk kelompok yang perlu dilibatkan secara budaya dan sosial?"
    ],
    "Vulnerable Groups & Poor Communities": [
      "Apakah kelompok ini sangat bergantung pada bantuan sosial dan layanan proyek untuk kelangsungan hidup sehari-hari?",
      "Apakah penghentian proyek berpotensi memperburuk kondisi sosial dan ekonomi mereka?"
    ],
    "Local Economic Actors & MSMEs": [
      "Apakah penghentian proyek berpotensi memperburuk kondisi sosial dan ekonomi pelaku usaha lokal?",
      "Apakah kelangsungan usaha mereka sangat dipengaruhi oleh keberadaan tenaga kerja proyek?",
      "Apakah stakeholder ini mengalami peningkatan ekonomi selama proyek berlangsung?"
    ],
    "Local Workers, Projects, & Companies": [
      "Apakah stakeholder ini mengandalkan proyek sebagai mata pencaharian utama bagi keluarga mereka?",
      "Apakah penghentian proyek akan langsung berdampak pada penghasilan dan kesejahteraan ekonomi mereka?",
      "Apakah mereka memerlukan kepastian kerja dan keterlibatan berkelanjutan dari proyek?"
    ],
    "Service Providers & Project Business Partners": [
      "Apakah stakeholder ini bergantung pada proyek sebagai sumber utama pendapatan melalui kontrak dan layanan?",
      "Apakah keterlambatan atau penghentian proyek dapat mengganggu operasional dan stabilitas finansial mereka?"
    ],
    "Supporting Business Partners & Medium SMEs": [
      "Apakah mereka menjadikan proyek sebagai salah satu dari beberapa sumber pendapatan?",
      "Apakah relasi dengan proyek bersifat bersyarat atau tidak eksklusif?"
    ],
    "Traditional & Independent Local Business Actors": [
      "Apakah proyek memberikan akses pasar atau modal tambahan?",
      "Apakah proyek mendukung diversifikasi usaha mereka?",
      "Apakah mereka tetap bisa bertahan tanpa proyek, tetapi mengalami peningkatan ketika proyek hadir?"
    ],
    "Non-Permanent Workers & Freelancers": [
      "Apakah mereka bekerja secara musiman atau sementara dalam proyek?",
      "Apakah mereka memiliki pekerjaan lain di luar proyek?"
    ],
    "Secondary Suppliers & Goods Providers": [
      "Apakah mereka masuk dalam rantai pasok tidak langsung atau tidak eksklusif proyek?",
      "Apakah proyek memberikan peluang pasar tambahan tanpa menjadi satu-satunya pelanggan?"
    ],
    "Educational Institutions": [
      "Apakah lembaga ini mendapat manfaat dari pelatihan, magang, atau program kemitraan dari proyek?",
      "Apakah hubungan dengan proyek bersifat tambahan atau pendukung?"
    ],
    "NGOs & Community Social Organizations": [
      "Apakah mereka menerima bantuan program dari proyek secara tidak rutin atau bisa digantikan?",
      "Apakah proyek mendukung program mereka melalui kolaborasi, bukan kewajiban struktural?",
      "Apakah mereka tetap beroperasi tanpa ketergantungan langsung pada proyek?"
    ]
  },
  alignment: {
    "Government and Regulatory Authorities": [
      "Apakah stakeholder ini memiliki kewenangan untuk memberikan atau mencabut izin proyek?",
      "Apakah mereka dapat mengubah atau menolak kebijakan yang memengaruhi kelangsungan proyek?",
      "Apakah mereka memiliki fungsi pengawasan dan dapat melakukan audit atau investigasi?"
    ],
    "Oil and Gas Regulators (Upstream/Downstream)": [
      "Apakah regulator ini berwenang menutup atau menghentikan operasi proyek?",
      "Apakah mereka menetapkan standar teknis dan regulasi yang wajib dipatuhi oleh proyek?",
      "Apakah proyek bergantung pada persetujuan, pelaporan, atau izin rutin dari pihak ini?"
    ],
    "Industry Stakeholders": [
      "Apakah stakeholder ini merupakan operator utama atau memiliki kepentingan finansial dalam proyek?",
      "Apakah mereka dapat menghentikan dukungan, menarik investasi, atau memutuskan kerja sama?",
      "Apakah proyek bergantung pada keberlanjutan kolaborasi dengan mereka untuk operasi harian?",
      "Apakah stakeholder ini memiliki peran sebagai mitra strategis atau pemilik infrastruktur utama?",
      "Apakah mereka tunduk pada tekanan publik atau politik yang bisa berdampak pada proyek?"
    ],
    "Civil Society / Local Communities": [
      "Apakah komunitas ini memiliki riwayat konflik atau demonstrasi terhadap proyek?",
      "Apakah mereka memiliki kapasitas untuk mengorganisir mobilisasi atau memblokir akses?",
      "Apakah mereka menyuarakan tuntutan yang belum terpenuhi terkait dampak sosial/lingkungan?"
    ],
    "Employee Representatives / Labor Unions": [
      "Apakah perwakilan ini berperan aktif dalam menyuarakan hak dan kondisi kerja?",
      "Apakah mereka memiliki potensi untuk melakukan aksi mogok atau tekanan industrial?",
      "Apakah tuntutan mereka bisa berdampak pada efisiensi atau kelangsungan operasi proyek?"
    ],
    "Stakeholders on Social Issues and Conflicts": [
      "Apakah stakeholder ini memiliki riwayat konflik atau sengketa terkait proyek?",
      "Apakah mereka berpotensi melakukan protes atau gangguan sosial yang dapat memengaruhi kelancaran proyek?"
    ],
    "Media, NGOs, and Public Advocacy": [
      "Apakah pemangku kepentingan ini dapat memengaruhi opini publik secara negatif terhadap proyek?",
      "Apakah mereka berpotensi menyebarkan informasi negatif atau kampanye yang merugikan proyek?",
      "Apakah mereka aktif dalam advokasi atau diskusi publik yang dapat memengaruhi persepsi proyek?"
    ],
    "Professionals, Technical Experts, and Operational Partners": [
      "Apakah terdapat risiko gangguan operasional akibat kendala teknis atau kualitas?",
      "Apakah terdapat risiko keterlambatan pekerjaan atau penyampaian hasil teknis dari mitra operasional?",
      "Apakah terdapat kekurangan tenaga ahli atau keterampilan teknis yang berdampak pada pelaksanaan proyek?"
    ],
    "Religious Leaders, Traditional Authorities, and Custodians of Socio-Cultural Values": [
      "Apakah terdapat ketidaksesuaian budaya atau penolakan nilai lokal terhadap proyek?",
      "Apakah terdapat isu sensitivitas agama atau moral yang dapat menghambat pelaksanaan proyek?",
      "Apakah terdapat tuntutan perlindungan adat, situs budaya, atau simbol keagamaan?"
    ]
  },
  opportunity: {
    "Government & Regulatory Authorities": [
      "Apakah pemerintah daerah dapat memfasilitasi perizinan lokal atau menyelaraskan program pembangunan dengan proyek?",
      "Apakah mereka memiliki peran dalam anggaran desa atau alokasi sumber daya lokal terkait proyek?"
    ],
    "Community Leader / Village Head": [
      "Apakah tokoh masyarakat memiliki pengaruh kuat dalam penerimaan masyarakat terhadap proyek?",
      "Apakah mereka memiliki wawasan lokal atau peran mediasi yang dapat mempercepat penyelesaian konflik?"
    ],
    "Oil and Gas Industry Operators / State-Owned Enterprises / Regionally-Owned Enterprises": [
      "Apakah stakeholder ini dapat menjadi mitra dalam aspek teknis atau investasi proyek?",
      "Apakah ada potensi sinergi dalam operasional, infrastruktur, atau logistik?"
    ],
    "Local Communities & Community Groups": [
      "Apakah komunitas menunjukkan dukungan aktif atau kemitraan dalam kegiatan sosial proyek?",
      "Apakah mereka memiliki pengetahuan lokal yang dapat membantu mitigasi risiko sosial/lingkungan?"
    ],
    "Oil and Gas Technical Regulator / BPMA / SKK MIGAS / Related Agencies": [
      "Apakah mereka dapat memberikan dukungan teknis, pengawasan, atau panduan operasional?",
      "Apakah mereka memiliki peran dalam peningkatan kapasitas teknis lokal?"
    ],
    "Workers & Employees Union": [
      "Apakah stakeholder ini mendukung produktivitas dan hubungan kerja yang harmonis?",
      "Apakah mereka bersedia terlibat dalam pengembangan SDM dan pelatihan?"
    ],
    "Academics & Educational Institutions": [
      "Apakah mereka dapat mendukung proyek melalui riset, pelatihan, atau konsultasi?",
      "Apakah mereka dapat menjadi mitra dalam inovasi atau penyebaran pengetahuan?"
    ],
    "Media & Public Communications": [
      "Apakah mereka dapat membantu membangun citra positif proyek di mata publik?",
      "Apakah mereka terbuka untuk kampanye edukasi publik atau peliputan konstruktif?"
    ],
    "NGOs & Social Organizations": [
      "Apakah mereka bersedia berkolaborasi dalam program CSR, lingkungan, atau sosial?",
      "Apakah mereka dapat membantu menjangkau komunitas rentan atau spesifik?"
    ],
    "Business & Industry Association": [
      "Apakah asosiasi dapat memperluas jejaring bisnis, peluang investasi, atau advokasi kebijakan?"
    ],
    "Business Partners & Service Providers": [
      "Apakah mereka berkontribusi pada efisiensi operasional atau kualitas proyek?"
    ],
    "Religious & Cultural Groups": [
      "Apakah mereka mendukung penerimaan sosial proyek melalui nilai dan norma lokal?"
    ]
  },
  risk: {
    "Government & Regulatory Authorities": [
      "Apakah stakeholder ini memiliki kewenangan untuk memberikan atau mencabut izin proyek?",
      "Apakah mereka memiliki kekuasaan untuk memberlakukan sanksi, audit, atau penutupan proyek?",
      "Seberapa sering mereka melakukan pengawasan atau intervensi terhadap proyek?"
    ],
    "Oil and Gas Industry Operators / State-Owned Enterprises (SOEs) / Regional-Owned Enterprises (ROEs)": [
      "Apakah mereka memiliki peran kunci dalam operasi atau investasi proyek?",
      "Apakah terdapat risiko kegagalan mitra, konflik internal, atau penghentian dukungan?",
      "Apakah proyek bergantung pada dukungan logistik, pasokan, atau teknologi dari stakeholder ini?",
      "Apakah terdapat potensi konflik kepentingan atau perubahan arah strategis dari stakeholder ini?",
      "Apakah mereka rentan terhadap tekanan politik atau intervensi?"
    ],
    "Technical Oil and Gas Regulators / BPMA / SKK MIGAS / Relevant Agencies": [
      "Apakah mereka menetapkan persyaratan teknis dan keselamatan operasional?",
      "Seberapa ketat mereka melakukan audit dan investigasi?",
      "Apakah ada riwayat sanksi atau penghentian proyek oleh mereka?"
    ],
    "Local Leaders / Communities & Community Groups": [
      "Apakah proyek berdampak langsung terhadap sumber daya, tanah, atau budaya mereka?",
      "Apakah kelompok ini pernah melakukan aksi protes atau penolakan sebelumnya?",
      "Apakah tokoh masyarakat atau kepala desa memiliki pengaruh signifikan terhadap penerimaan proyek di komunitas lokal?"
    ],
    "Labor Unions & Employees": [
      "Apakah ada ketegangan hubungan industrial atau potensi mogok kerja?",
      "Seberapa besar pengaruh mereka terhadap operasi sehari-hari?",
      "Apakah ada tuntutan kesejahteraan yang belum terpenuhi?"
    ],
    "Academics & Educational Institutions": [
      "Apakah mereka pernah mengkritisi proyek atau isu sejenis?",
      "Apakah mereka dilibatkan dalam riset sosial atau lingkungan?"
    ],
    "Media & Public Communication": [
      "Apakah mereka pernah menyebarkan narasi negatif atau misinformasi?",
      "Seberapa besar pengaruh opini publik melalui saluran ini?"
    ],
    "NGOs & Social Organizations": [
      "Apakah mereka aktif dalam isu lingkungan, sosial, atau HAM di wilayah proyek?",
      "Apakah mereka memiliki dukungan masyarakat lokal atau jaringan internasional?",
      "Apakah mereka memiliki catatan litigasi atau kampanye media?"
    ],
    "Business & Industry Associations": [
      "Apakah ada risiko konflik kepentingan terkait pasokan atau pasar?",
      "Apakah terjadi perubahan regulasi atau persaingan tidak sehat?"
    ],
    "Business Partners & Service Providers": [
      "Apakah mereka memiliki rekam jejak buruk atau ketidaksesuaian teknis?",
      "Apakah mereka bergantung penuh pada proyek ini?"
    ],
    "Religious & Cultural Groups": [
      "Apakah ada sensitivitas budaya atau keagamaan di wilayah proyek?",
      "Apakah kelompok ini memiliki potensi memobilisasi penolakan moral?",
      "Apakah stakeholder ini menunjukkan ketidakpercayaan tinggi terhadap pemerintah, perusahaan, atau lembaga luar?"
    ]
  },
  benefit: {
    "Government & Regulatory Authorities": [
      "Apakah keterlibatan pemerintah dan kementerian dapat mempercepat proses, mendukung kelancaran operasional, serta menjaga keamanan dan ketertiban proyek?",
      "Apakah mereka dapat membantu memperkuat penerimaan sosial dan reputasi proyek di masyarakat?",
      "Apakah pemerintah ini berperan sebagai sumber pengetahuan dan mitra strategis dalam sinergi kebijakan?"
    ],
    "Community, Traditional, and Religious Leaders": [
      "Apakah keterlibatan komunitas lokal, termasuk tokoh adat dan masyarakat, dapat memperkuat penerimaan sosial, akses wilayah, dan koordinasi proyek?",
      "Apakah mereka membawa nilai budaya, pengetahuan lokal, serta berperan dalam menjaga harmoni dan menyelesaikan konflik secara konstruktif?"
    ],
    "Local Business and Economic Actors": [
      "Apakah pelibatan pelaku usaha dan tenaga kerja lokal dapat meningkatkan efisiensi operasional serta mendukung stabilitas proyek?",
      "Apakah pelibatan mereka mendukung citra perusahaan sebagai pemberi kerja yang bertanggung jawab dan adaptif terhadap kondisi lokal?"
    ],
    "Social, Academic, and NGO/CSO Organizations": [
      "Apakah organisasi ini dapat menjadi mitra strategis dalam program sosial, penguatan partisipasi, dan penerimaan masyarakat terhadap proyek?",
      "Apakah mereka dapat meningkatkan kredibilitas, transparansi, dan reputasi proyek melalui pendekatan ESG dan kolaborasi publik?",
      "Apakah mereka menyediakan masukan riset atau pengetahuan berbasis data yang memperkuat pengambilan keputusan dan legitimasi proyek?"
    ]
  },
  category: {
    "Government & Regulatory Authorities": [
      "Apakah stakeholder ini memiliki otoritas langsung di tingkat desa dan daerah, berperan penting dalam perizinan dan pengelolaan wilayah?",
      "Apakah stakeholder ini sebagai pemerintah daerah dengan kewenangan langsung dalam perizinan dan pelaksanaan operasional proyek di wilayahnya?",
      "Apakah stakeholder ini memiliki otoritas tinggi dan pengaruh signifikan terhadap kebijakan dan perizinan regional. Keterlibatan mereka penting untuk kelancaran proyek?",
      "Apakah stakeholder ini berperan dalam mendukung pelaksanaan teknis dan regulasi di tingkat kecamatan. Keterlibatan dilakukan secara berkala dan berdasarkan kebutuhan?"
    ],
    "Community / Traditional / Religious Leaders": [
      "Apakah stakeholder ini berperan sebagai pemimpin komunitas dengan pengaruh sosial dan budaya yang kuat, penting untuk kelancaran proyek?",
      "Apakah stakeholder ini memiliki pengaruh moral dan sosial dalam komunitas, mendukung penerimaan sosial proyek?"
    ],
    "Social Risk Stakeholders": [
      "Apakah stakeholder ini memiliki kekhawatiran terhadap proyek?",
      "Apakah terdapat potensi konflik atau ketidaksepakatan antara proyek dan stakeholder ini?"
    ],
    "Stakeholders with Social & Economic Influence": [
      "Apakah mereka/dia ini sebagai pemangku kepentingan ekonomi lokal yang berperan dalam iklim bisnis dan dukungan ekonomi proyek?",
      "Apakah stakeholder ini sebagai pendukung advokasi dan pengawas sosial yang memengaruhi opini publik dan hubungan komunitas?",
      "Apakah stakeholder ini berperan sebagai pengawas dan penyebar informasi lokal yang dapat memengaruhi opini publik?"
    ]
  },
};


export default function ClusterQuestions() {
  const { clusterId, stakeholderId } = useParams();
  const id = clusterId;
  const clusterName = id ? id.charAt(0).toUpperCase() + id.slice(1) : "";
  console.log(id);
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

    const res = await fetch(`/sheets/${SHEET_ID}/save`, {
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
          <h1 className="text-white">Overview</h1>
          <p className="text-white">
            Collects and manages stakeholder information to support effective
            coordination, communication, and decision making.
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
                    {subCluster} Questions
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
                              Yes
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
                              No
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
                                alert("Cluster selesai dan tersimpan!");
                              } else {
                                setOpenIndex(idx + 1);
                              }
                            }}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow ml-auto"
                          >
                            {idx === Object.entries(questions[id]).length - 1
                              ? "Finish"
                              : "Complete → Next"}
                          </button>
                        </div>
                      ) : (
                        !clusterAlreadyDone && (
                          <p className="mt-4 text-yellow-300">
                            Please answer all questions before proceeding.
                          </p>
                        )
                      )}
                    </div>
                  )}

                  {!clusterAlreadyDone && isLocked && (
                    <div className="p-4 text-red-500 font-medium">
                      Please complete the assessment above!
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>Cluster ini berupa array pertanyaan langsung</p>
          )
        ) : (
          <p>Tidak ada pertanyaan untuk cluster ini.</p>
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
          ← Back to Stakeholder Profile Setup
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
                alert("🎉 Semua cluster sudah selesai!");
                window.location.href = stakeholderId ? `/stakeholderprofilesetup/${stakeholderId}` : "/stakeholderprofilesetup";
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg font-bold"
          >
            {clusterOrder.indexOf(id) === clusterOrder.length - 1
              ? "Continue to Next Cluster →"
              : "Continue to Next Cluster →"
            }
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-400 text-white px-6 py-3 rounded-lg font-bold cursor-not-allowed"
          >
            Lengkapi semua pertanyaan dulu
          </button>
        )}
      </div>
    </div>
  );
}
