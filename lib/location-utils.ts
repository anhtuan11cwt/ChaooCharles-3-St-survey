import {
  getAllProvince,
  getDistrictsByProvinceId,
} from "vietnam-divisions-js/provinces";

// Cache dữ liệu tỉnh/huyện để tránh gọi API nhiều lần
let provincesCache: { idProvince: string; name: string }[] | null = null;
const districtsCache = new Map<
  string,
  { idDistrict: string; name: string }[]
>();

async function getProvinces() {
  if (!provincesCache) {
    provincesCache = await getAllProvince();
  }
  return provincesCache;
}

async function getDistricts(provinceId: string) {
  if (!districtsCache.has(provinceId)) {
    const districts = await getDistrictsByProvinceId(provinceId);
    districtsCache.set(provinceId, districts);
  }
  return districtsCache.get(provinceId) ?? [];
}

export async function resolveProvinceName(provinceId: string): Promise<string> {
  const provinces = await getProvinces();
  const province = provinces.find((p) => p.idProvince === provinceId);
  return province?.name ?? provinceId;
}

export async function resolveDistrictName(
  provinceId: string,
  districtId: string,
): Promise<string> {
  const districts = await getDistricts(provinceId);
  const district = districts.find((d) => d.idDistrict === districtId);
  return district?.name ?? districtId;
}

// Lấy tên tỉnh và huyện từ mã ID
export async function resolveLocationNames(
  stateId: string,
  cityId: string,
): Promise<{ stateName: string; cityName: string }> {
  const [stateName, cityName] = await Promise.all([
    resolveProvinceName(stateId),
    resolveDistrictName(stateId, cityId),
  ]);
  return { cityName, stateName };
}
