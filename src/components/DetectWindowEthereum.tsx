import React, { memo, useEffect, useState } from 'react';

export const DetectWindowEthereum = memo(function () {
  const [debug] = useState(() => true);
  const [exists, setExists] = useState(() => !!window.ethereum);

  useEffect(() => {
    const handle = setInterval(() => {
      setExists(!!window.ethereum);
    }, 500);
    return () => clearInterval(handle);
  }, [setExists]);

  return debug ? (
    <div
      style={{
        textAlign: 'center',
        color: exists ? 'green' : '#f00',
        background: '#fff',
      }}
    >
      window.ethereum {exists ? 'exists' : 'does not exist'}
    </div>
  ) : null;
});
