import { useCallback } from "react";
import type { District } from "vietnam-divisions-js/districts";
import type { Province } from "vietnam-divisions-js/provinces";
import {
  getAllProvince,
  getDistrictsByProvinceId,
} from "vietnam-divisions-js/provinces";

export type { District, Province };

export default function useLocation() {
  const fetchAllProvinces = useCallback(async (): Promise<Province[]> => {
    return getAllProvince();
  }, []);

  const fetchDistrictsByProvinceId = useCallback(
    async (provinceId: string): Promise<District[]> => {
      return getDistrictsByProvinceId(provinceId);
    },
    [],
  );

  return {
    fetchAllProvinces,
    fetchDistrictsByProvinceId,
  };
}
