import type { NextPage } from 'next';
import { useState, useRef, FormEvent } from 'react';
import axios from 'axios';

import { Public } from '../libs/public-env';
import { IGenerateUrlBody } from '../libs/type';

const Home: NextPage = () => {
  const formRef = useRef(null);
  const [url, setUrl] = useState<string>('');
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const asyncStaticGeneration = async (target: string) => {
    try {
      await axios.get(target);
    } catch (error) {
      console.error('static generation attempt failed');
      console.error(error);
    }
  };

  const handleRegisterURL = async (e: FormEvent) => {
    e.preventDefault();
    if (url.length) {
      setMessage('');
      setGeneratedUrl('');

      let code: string | undefined = undefined;
      try {
        const { data: { code: newCode } } = await axios.post<IGenerateUrlBody>(
          '/api/generate',
          { url },
        );
        code = newCode;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data as string);
        } else if (error instanceof Error) {
          setMessage(error.message);
        }
        console.error(error);
        return;
      }

      if (!code) {
        setMessage('internal server error');
        return;
      }
      const newUrl = Public.NEXT_PUBLIC_APP_URL + '/' + code;
      setMessage('success!');
      asyncStaticGeneration(newUrl);
      setGeneratedUrl(newUrl);
    }
  };
  
  return (
    <>
      <form ref={formRef} onSubmit={(e) => handleRegisterURL(e)}>
        <input 
          type="url" 
          style={{ width: '20rem' }} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Please enter URL you want to shorten."
          required
        />
        <input type="submit" value="submit"/>
      </form>
      <div>{message}</div>
      {generatedUrl ? <a href={generatedUrl}>{generatedUrl}</a> : null}
    </>
  );
};

export default Home;
