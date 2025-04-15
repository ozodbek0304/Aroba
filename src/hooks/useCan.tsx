import { useMemo } from 'react';
import { useUser } from "@/constants/useUser";

export default function useCan(url: string) {
    const { perms, info } = useUser();
    const hasPermission = useMemo(() => {
        return !!perms?.map(p => p.url)?.find(f => f === url);
    }, [perms, url]);

    return hasPermission || info?.is_superuser;
}
