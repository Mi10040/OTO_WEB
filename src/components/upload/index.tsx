import React, { FC, useEffect, useState } from 'react';
import { Card, Input } from 'antd';
import { CardProps } from 'antd/lib/card';

type PropsTpye = {
  dropFileFc: (files: FileList) => void;
  cilckFileFc: (file: FileList) => void;
  type?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Upload: FC<PropsTpye> = ({
  children,
  dropFileFc,
  cilckFileFc,
  type = '',
  ...props
}) => {
  const upload = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropFileFc(e.dataTransfer.files);
  };

  const over = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const cilck = () => {
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = type;
    input.click();
    input.onchange = () => {
      if (input.files) {
        cilckFileFc(input.files);
      }
    };
  };

  return (
    <div
      style={{ width: '100%', height: '300px' }}
      onDrop={upload}
      onDragOver={over}
      onClick={cilck}
      {...props}
    >
      {children}
    </div>
  );
};

export default Upload;
