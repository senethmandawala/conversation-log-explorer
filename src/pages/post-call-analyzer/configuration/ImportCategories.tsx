import { useState } from "react";
import { 
  Button, 
  Card, 
  Switch, 
  Typography, 
  Space, 
  Upload, 
  Tooltip,
  Spin,
  Divider,
  type UploadProps
} from "antd";
import { 
  IconUpload, 
  IconTrash, 
  IconInfoCircle, 
  IconDownload 
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import type { UploadChangeParam } from "antd/es/upload";

const { Text, Title } = Typography;
const { Dragger } = Upload;

export default function ImportCategories() {
  const [contentLoading, setContentLoading] = useState(false);
  const [fileAccepted, setFileAccepted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const MaximumFileSize = "20";

  const handleFileChange = (info: UploadChangeParam) => {
    if (info.fileList && info.fileList.length > 0) {
      setFileAccepted(true);
    }
  };

  const removeFile = () => {
    setFileAccepted(false);
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setFileAccepted(false);
    }, 2000);
  };

  if (contentLoading) {
    return <Spin size="large" className="flex justify-center items-center h-96" />;
  }

  return (
    <div className="space-y-4">
      <Text className="text-sm text-gray-600 block font-sans">
        Import categories from a CSV file. You can download a sample file to see the required format.
      </Text>

      <Card 
        className="border border-gray-200"
        styles={{ body: { padding: '12px', borderLeft: 'none' } }}
      >
        <div className="flex items-center justify-between">
          <Text className="text-sm text-gray-700 font-sans">Download sample file</Text>
          <Button 
            type="default" 
            size="small" 
            icon={<IconDownload />}
            className="flex items-center gap-2"
          >
            Download
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {!fileAccepted ? (
          <div>
            <Dragger
              name="file"
              accept=".csv"
              beforeUpload={() => false}
              onChange={handleFileChange}
              className="rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors h-48 font-sans border-2 border-dashed border-gray-300"
            >
              <p className="ant-upload-drag-icon">
                <IconUpload className="text-4xl text-gray-400 mb-3" />
              </p>
              <p className="ant-upload-text text-sm text-gray-600 text-center mb-2">
                <span className="font-semibold">Drag & drop files here</span>
                <br />
                or
                <br />
                <span className="font-bold border-b border-blue-500 text-blue-500">Choose files</span>
              </p>
            </Dragger>
            <div className="flex justify-between flex-wrap mt-2 text-xs text-gray-500">
              <span>Supported file types: *.csv</span>
              <span>File size max: {MaximumFileSize} MB</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Text className="text-sm font-medium mb-2 block text-gray-900 font-sans">Upload File</Text>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                <Text className="text-sm break-all text-gray-700 font-sans">File_name_goes_here.csv</Text>
                <Button
                  type="text"
                  size="small"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={removeFile}
                >
                  <IconTrash className="text-sm" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={replaceExisting}
                onChange={setReplaceExisting}
              />
              <Text 
                className="text-sm cursor-pointer text-gray-700 font-sans"
              >
                Replace existing category list
              </Text>
              <Tooltip title="If enabled, existing categories will be replaced. Otherwise, they will be merged.">
                <IconInfoCircle className="text-sm text-gray-400" />
              </Tooltip>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <IconInfoCircle className="text-sm" />
                <Text className="font-sans">File size maximum: {MaximumFileSize} MB</Text>
              </div>
              <Button 
                type="primary" 
                onClick={handleUpload} 
                loading={isUploading}
                icon={<IconUpload />}
                className="flex items-center gap-2"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
