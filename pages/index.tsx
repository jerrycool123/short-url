import type { NextPage } from 'next';
import { useState } from 'react';
import axios from 'axios';

import { Public } from '../libs/public-env';
import { IGenerateUrlBody } from '../libs/type';

const Home: NextPage = () => {
  const [url, setUrl] = useState<string>('');
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const staticGeneration = async (target: string) => {
    try {
      await axios.get(target);
    } catch (error) {
      console.error('static generation attempt failed');
      console.error(error);
    }
  };

  const handleRegisterURL = async () => {
    if (url.length) {
      setMessage('');
      setGeneratedUrl('');
      const { data: { code } } = await axios.post<IGenerateUrlBody>(
        '/api/generate',
        { url },
      );
      if (!code) {
        setMessage('internal server error');
        return;
      }
      const newUrl = Public.NEXT_PUBLIC_APP_URL + '/' + code;
      setMessage('success!');
      staticGeneration(newUrl);
      setGeneratedUrl(newUrl);
      console.log(newUrl);
    }
  };
  
  return (
    <>
      <input type="url" onChange={(e) => setUrl(e.target.value)} />
      <button disabled={!url.length} onClick={handleRegisterURL}>submit</button>
      <div>{message}</div>
      {generatedUrl ? <a href={generatedUrl}>{generatedUrl}</a> : null}
    </>
  );
};

export default Home;
