import axios from "axios";
import { useEffect, useState } from "react";

export type Option = {
  id: string;
  name: string;
  priceModifier: number;
};

export type OptionGroup = {
  id: string;
  name: string;
  options: Option[];
};

export type Profile = {
  id: string;
  name: string;
  chest: number;
};

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

export function GROUPS() {
  const [groups, setGroups] = useState<OptionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // 1. Fetch all customization groups to get their IDs
        const groupsResponse = await axios.get(
          `${API_URL}/customisation-groups`
        );

        const groupIds = groupsResponse.data.map(
          (group: any) => group.id
        );

        // 2. Fetch each group and its options
        const results = await Promise.all(
          groupIds.map(async (groupId: string) => {
            const groupResponse = await axios.get(
              `${API_URL}/customisation-groups/${groupId}`
            );

            const optionsResponse = await axios.get(
              `${API_URL}/customisation-groups/${groupId}/options`
            );

            return {
              id: groupResponse.data.id,
              name: groupResponse.data.name,
              options: optionsResponse.data.map((option: any) => ({
                id: option.id,
                name: option.name,
                priceModifier: Number(option.price_modifier),
              })),
            };
          })
        );

        setGroups(results);
      } catch (error) {
        console.error("Error fetching customisation groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return { groups, loading };
}