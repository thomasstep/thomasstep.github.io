```jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


function Example() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log('pre-check')

    if (!id) {
      console.log('not found')
      return;
    }

    console.log('found')
  }, [id]);


  return (
    <Layout>
      {id || 'Loading'}
    </Layout>
  );
}

export default Example;
```