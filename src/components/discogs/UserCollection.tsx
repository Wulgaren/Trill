import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Discogs from "./Discogs";

function UserCollection({
  accessToken,
  username = "",
}: {
  accessToken: string;
  username?: string;
}) {
  const userCollectionQueryKey = "discogs_user_collection";

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [userCollectionQueryKey, username],
    queryFn: ({ pageParam = 1 }) =>
      Discogs.GetUserCollection({
        pageParam,
        queryKey: [userCollectionQueryKey, username],
      }),
    getNextPageParam: (lastPage) => {
      const page = lastPage?.pagination?.page ?? 0;
      const allPages = lastPage?.pagination?.pages ?? 0;

      if (page == allPages) return null;
      return page + 1;
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (hasNextPage) {
      fetchNextPage();
    } else if (data && !username)
      sessionStorage.setItem("discogsCollection", JSON.stringify(data));
  }, [data, fetchNextPage, hasNextPage, username]);

  return <></>;
}

export default UserCollection;
