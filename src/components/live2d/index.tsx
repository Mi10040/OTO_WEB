import React, { useEffect } from 'react';
import './lib/live2d.min.js';
import { v1 as uuidv1 } from 'uuid';

export const useKbn = (model: string, width: number, height: number) => {
  let uid = uuidv1();
  useEffect(() => {
    loadlive2d(`${uid}`, model);
  }, []);

  return (
    <div id="use-kbn-root">
      <canvas id={`${uid}`} width={width} height={height} />
    </div>
  );
};
