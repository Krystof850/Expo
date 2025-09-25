import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { isFirstTimeUser } from '../src/utils/firstTimeUser';

export default function Index() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      const firstTime = await isFirstTimeUser();
      setIsFirstTime(firstTime);
    };

    checkFirstTimeUser();
  }, []);

  // Show nothing while checking first-time status
  if (isFirstTime === null) {
    return null;
  }

  // Redirect to appropriate welcome screen
  if (isFirstTime) {
    return <Redirect href="/(onboarding)/welcome-first-time" />;
  } else {
    return <Redirect href="/(onboarding)/welcome-new" />;
  }
}