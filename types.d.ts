import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';

export interface NextPageWithGetLayout<P = {}, IP = P> extends NextPage<P, IP> {
  getLayout?: (page: ReactElement) => ReactNode;
}