import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';

import { Public } from '../libs/public-env';
import dbConnect from '../libs/mongo';
import UrlModel, { IUrlDoc } from '../models/url';

type TCodePageParams = {
  code: string;
}

const CodePage: NextPage = () => {
  return <></>;
};

export const getStaticPaths: GetStaticPaths<TCodePageParams> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<any, TCodePageParams> = async ({ params }) => {
  if (!params) return { props: { target: null } };
  const { code } = params;
  if (!code || typeof code !== 'string') return { props: { target: null } };
  await dbConnect();
  const urlDoc = await UrlModel.findOne<IUrlDoc>({ code });
  return {
    props: {},
    redirect: {
      destination: urlDoc ? urlDoc.target : '/',
      statusCode: 301,
    },
    revalidate: 1,
  };
};

export default CodePage;
