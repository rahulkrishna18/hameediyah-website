export type Credit = {
  file: string;
  title: string;
  author: string;
  license: string;
  licenseUrl?: string;
  source: string;
  note?: string;
};

const CC0 = { license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" };
const PD = { license: "Public domain" };
const BYSA4 = { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };
const BYSA3 = { license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" };
const commons = (f: string) => `https://commons.wikimedia.org/wiki/File:${f}`;

export const imageCredits: Credit[] = [
  { file: "hameediyah-facade.jpg", title: "Hameediyah Restaurant, Campbell Street", author: "Slleong", ...CC0, source: commons("Hameediyah_1.jpg") },
  { file: "hameediyah-queue-a.jpg", title: "Queue outside Hameediyah Restaurant", author: "Slleong", ...CC0, source: commons("Hameediyah_2.jpg") },
  { file: "hameediyah-queue-b.jpg", title: "Queue outside Hameediyah Restaurant", author: "Slleong", ...CC0, source: commons("Hameediyah_3.jpg") },
  { file: "hameediyah-queue-c.jpg", title: "Queue at Hameediyah Restaurant", author: "Slleong", ...CC0, source: commons("Hameediyah_4.jpg") },
  { file: "weld-quay-1910.jpg", title: "Weld Quay, Penang, c. 1910", author: "C.J. Kleingrothe (KITLV collection)", ...PD, source: commons("KITLV_-_80022_-_Kleingrothe,_C.J._-_Medan_-_Weld_Quay,_Penang_-_circa_1910.tif") },
  { file: "quay-1910.jpg", title: "Quay in Penang, c. 1910", author: "C.J. Kleingrothe (KITLV collection)", ...PD, source: commons("KITLV_-_80020_-_Kleingrothe,_C.J._-_Medan_-_Quay_in_Penang_-_circa_1910.tif") },
  { file: "pier-1910.jpg", title: "New pier at Penang, c. 1910", author: "C.J. Kleingrothe (KITLV collection)", ...PD, source: commons("KITLV_-_80023_-_Kleingrothe,_C.J._-_Medan_-_New_pier_at_Penang_-_circa_1910.tif") },
  { file: "beach-street-1910.jpg", title: "Beach Street in Penang, c. 1910", author: "C.J. Kleingrothe (KITLV collection)", ...PD, source: commons("KITLV_-_80026_-_Kleingrothe,_C.J._-_Medan_-_Beach_Street_in_Penang_-_circa_1910.tif") },
  { file: "beach-street-1910-b.jpg", title: "Beach Street in Penang, c. 1910", author: "C.J. Kleingrothe (KITLV collection)", ...PD, source: commons("KITLV_-_80029_-_Kleingrothe,_C.J._-_Medan_-_Beach_Street_in_Penang_-_circa_1910.tif") },
  { file: "harbour-ships.jpg", title: "Ships in Penang harbour", author: "August Kaulfuss (Nationaal Museum van Wereldculturen)", ...PD, source: commons("Collectie_NM_van_Wereldculturen_TM-60035047_Schepen_in_de_haven_van_Penang_Fotograaf_A._(August)_Kaulfuss_(1861_-_1909).jpg") },
  { file: "admiralty-chart-1909.jpg", title: "Admiralty Chart No. 3732, Penang Harbour, 1909", author: "United Kingdom Hydrographic Office", ...PD, source: commons("Admiralty_Chart_No_3732_Penang_Harbour,_Published_1909.jpg") },
  { file: "nasi-kandar-1950s.jpg", title: "Nasi kandar sellers, 1950s", author: "Unknown", ...PD, source: commons("Nasi_Kandar_1950s.jpg"), note: "Shows the kandar tradition generally; not Hameediyah." },
  { file: "campbell-street-2026.jpg", title: "Campbell Street, George Town, May 2026", author: "Weareblahs", ...BYSA4, source: commons("Campbell_Street,_George_Town,_Penang_-_May_3_2026.jpg") },
  { file: "angsana.jpg / angsana-canopy.jpg", title: "Angsana tree (Pterocarpus indicus)", author: "Mokkie", ...BYSA3, source: commons("Angsana_tree.jpg"), note: "Illustrative; cropped." },
  { file: "weld-quay-2023.jpg", title: "Weld Quay, George Town, 2023", author: "HundenvonPenang", ...BYSA4, source: commons("Weld_Quay,_George_Town,_Penang_(1)_2023.jpg") },
  { file: "dish-briyani.jpg", title: "Malaysian nasi biryani", author: "Miansari66", ...CC0, source: commons("Malaysian_Nasi_Biryani.JPG"), note: "Illustrative; cropped." },
  { file: "dish-kurmah.jpg", title: "Chicken korma", author: "Miansari66", ...CC0, source: commons("Chicken_Korma.JPG"), note: "Illustrative; cropped." },
  { file: "dish-rendang.jpg", title: "Beef rendang", author: "Miansari66", ...CC0, source: commons("Beef_Rendang..JPG"), note: "Illustrative; cropped." },
  { file: "dish-mee-goreng.jpg", title: "Mee goreng mamak", author: "Wiki Farazi", ...CC0, source: commons("Mee_goreng_mamak_20231114_133123.jpg"), note: "Illustrative; cropped." },
  { file: "dish-murtabak.jpg", title: "Murtabak", author: "Mojackjutaily", ...BYSA4, source: commons("Murtabak.jpg"), note: "Illustrative; cropped." },
  { file: "dish-nasi-kandar.jpg", title: "Nasi kandar", author: "Wiki Asmah", ...BYSA4, source: commons("Nasi_kandar_-_01.jpg"), note: "Illustrative; cropped." },
  { file: "dish-nasi-kandar-b.jpg", title: "Nasi kandar", author: "Wiki Asmah", ...BYSA4, source: commons("Nasi_kandar_-_02.jpg"), note: "Illustrative; cropped." },
  { file: "chart-george-town.jpg", title: "Detail of Admiralty Chart No. 3732 (George Town)", author: "United Kingdom Hydrographic Office", ...PD, source: commons("Admiralty_Chart_No_3732_Penang_Harbour,_Published_1909.jpg") },
  { file: "ref-shopfront-2019.jpg", title: "The Hameediyah Restaurant in Lebuh Campbell", author: "Shahnaz Fazlie Shahrizal / New Straits Times", license: "© New Straits Times — reference material, licence required", source: "https://www.nst.com.my/news/nation/2019/08/514320/hameediyah-penangs-oldest-nasi-kandar-restaurant-still-going-strong" },
  { file: "ref-family-dishes-2019.jpg", title: "Ahmed Seeni Pakir and Abdul Sukkor Syed Ibrahim with Hameediyah dishes", author: "Shahnaz Fazlie Shahrizal / New Straits Times", license: "© New Straits Times — reference material, licence required", source: "https://www.nst.com.my/news/nation/2019/08/514320/hameediyah-penangs-oldest-nasi-kandar-restaurant-still-going-strong" },
  { file: "ref-counter-archive.jpg, ref-counter-archive-b.jpg, ref-golden-moments.jpg, ref-menu-board.jpg, ref-queue.jpg", title: "Archive and recent photographs of Hameediyah", author: "Shared by Lee Bp, PenangToday Community", license: "Rights holder to be confirmed — reference material", source: "https://www.facebook.com/groups/penangtoday/posts/3137769789707580/" },
];

export const dataCredits = [
  { title: "Coastlines and borders", author: "Natural Earth (1:10m Admin 0)", license: "Public domain", source: "https://www.naturalearthdata.com/" },
  { title: "Place coordinates", author: "© OpenStreetMap contributors", license: "ODbL", source: "https://www.openstreetmap.org/copyright" },
];
