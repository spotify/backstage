/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { createContext } from 'react';

export enum JokeType {
  'programming' = 'programming',
  'any' = 'any',
}

type Joke = {
  setup: string;
  punchline: string;
};

type RandomJokeContextValue = {
  loading: boolean;
  joke: Joke;
  type: JokeType;
  rerollJoke: Function;
  handleChangeType: Function;
};

const Context = createContext<RandomJokeContextValue | undefined>(undefined);

const getNewJoke = (type: string): Promise<Joke> =>
  fetch(
    `https://official-joke-api.appspot.com/jokes${
      type !== 'any' ? `/${type}` : ''
    }/random`,
  )
    .then(res => res.json())
    .then(data => (Array.isArray(data) ? data[0] : data));

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = React.useState(true);
  const [joke, setJoke] = React.useState<Joke>({
    setup: '',
    punchline: '',
  });
  const [type, setType] = React.useState<JokeType>('programming' as JokeType);

  const rerollJoke = React.useCallback(() => {
    setLoading(true);
    getNewJoke(type).then(newJoke => setJoke(newJoke));
  }, [type]);

  const handleChangeType = (newType: JokeType) => {
    setType(newType);
  };

  React.useEffect(() => {
    setLoading(false);
  }, [joke]);

  React.useEffect(() => {
    rerollJoke();
  }, [rerollJoke]);

  const value: RandomJokeContextValue = {
    loading,
    joke,
    type,
    rerollJoke,
    handleChangeType,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useRandomJoke = () => {
  const context = React.useContext(Context);

  if (context === undefined) {
    throw new Error('useRandomJoke must be used within a RandomQuoteProvider');
  }

  return context;
};

export default Context;
