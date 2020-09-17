import React, { FC, useState } from 'react';
import { Input, Form, Modal, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import UploadInpnt from '@/components/upload';

type PropsTpye = {
  changes: Function;
};

const Upload: FC<PropsTpye> = ({ changes }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const onCancel = () => {
    setVisible(v => !v);
  };

  const submit = () => {
    form.validateFields().then(values => {
      changes(values);
      onCancel();
    });
  };

  return (
    <>
      <UploadOutlined onClick={onCancel} />
      <Modal
        title="模块上传"
        visible={visible}
        maskClosable={false}
        width={'60vw'}
        onCancel={onCancel}
        destroyOnClose={true}
        footer={
          <Button onClick={submit} type={'primary'}>
            保存
          </Button>
        }
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
          <Form.Item
            wrapperCol={{ span: 16 }}
            rules={[{ required: true }]}
            name="upfile"
            label="上传"
          >
            <UploadInpnt />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }} name="mard" label="备注">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Upload;
