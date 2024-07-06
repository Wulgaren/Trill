import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { DiscogsCollectionResponse } from "../../types/Discogs/DiscogsTypes";
import { getNextPage } from "../functions/Functions";
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
        username,
      }),
    getNextPageParam: (lastPage: DiscogsCollectionResponse) => {
      return getNextPage(lastPage.pagination);
    },
    initialPageParam: 1,
    enabled: !!accessToken,
  });

  useEffect(() => {
    console.log(data, username, hasNextPage);
    if (hasNextPage) {
      fetchNextPage();
    } else if (data && !username) {
      sessionStorage.setItem(
        "discogsCollection",
        JSON.stringify(data.pages.flatMap((x) => x.releases?.map((y) => y.id))),
      );
    }
  }, [data, fetchNextPage, hasNextPage, username]);

  return <></>;
}

export default UserCollection;
