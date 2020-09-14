import React, { FC, useEffect, useState } from 'react';
import { Card, Input, Form, Modal } from 'antd';
import { CardProps } from 'antd/lib/card';
import TextArea from 'antd/lib/input/TextArea';

type PropsTpye = {
  val: Function;
  type?: string;
};

const input: HTMLInputElement = document.createElement('input');

const Upload: FC<PropsTpye> = ({ val, type = '' }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    val(onCancel);
  }, []);

  const upload = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // dropFileFc(e.dataTransfer.files);
  };

  const over = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const cilck = () => {
    input.type = 'file';
    input.accept = type;
    input.click();
    input.onchange = () => {
      if (input.files) {
        // cilckFileFc(input.files);
        input.value = '';
      }
    };
  };

  const onCancel = () => {
    setVisible(v => !v);
  };

  // onDrop={upload}
  // onDragOver={over}
  return (
    <Modal
      title="模块上传"
      visible={visible}
      maskClosable={false}
      footer={null}
      width={'60vw'}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <Form labelCol={{ span: 4 }} form={form} name="upload">
        <Form.Item
          wrapperCol={{ span: 8 }}
          name="name"
          label="模块名"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16 }} name="mard" label="备注">
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Upload;
