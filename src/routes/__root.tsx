import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { QueryClient } from "@tanstack/react-query";

export interface MyRouterContext {
  queryClient: QueryClient;
  auth: ReturnType<typeof useFirebaseUser>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
