import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Dropdown,
  Button,
  Menu,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  message,
  InputNumber,
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import moment from "moment";
import { 
  SaveOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import { 
  useGrade, 
  useDeleteGrade, 
  useCreateGrade, 
  useUpdateGrade 
} from "../../hooks/useGrade";
import { useDispatch, useSelector } from "react-redux";
import { setQR, selectQR } from "../../contexts/slices/qrSlice";

const Grade: React.FC<any> = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hiddenPrint, setHiddenPrint] = useState(false);
  const [visiblePrint, setVisiblePrint] = useState(false);
  const [grade, setGrade] = useState<any>({});
  const [gradeSearch, setGradeSearch] = useState<any>([]);
  const [dataSourcePrint, setDataSourcePrint] = useState<any>([]);

  const [formGrade] = Form.useForm();
  const [formPrint] = Form.useForm();
  const { Option } = Select;
  const qr = useSelector(selectQR);
  const {
    isLoading,
    isFetching,
    isError,
    data: Gradedata,
    status,
    error,
  } = useGrade();

  const {
    isLoading: createIsLoading,
    isError: createIsError,
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreateGrade();

  const {
    isLoading: updateIsLoading,
    isError: updateIsError,
    error: updateError,
    status: updateStatus,
    mutate: updateMutate,
  } = useUpdateGrade();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteGrade();

  const showModal = () => {
    formGrade.resetFields();

    setVisible(true);

    formGrade.setFieldsValue({
      Grade_Unit: "PC",
      Grade_Status: "1",
    });
  };

  const showModalPrint = () => {
    

    setVisiblePrint(true);

    
  };

  const handleOk = (value: any) => {
    if (value?.Grade_Index) {
      updateMutate(value);
    } else {
      createMutate(value);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    formGrade.resetFields();
    setHiddenPrint(true);
  };

  const handleCancelPrint = () => {
    setVisiblePrint(false);
  };

  
  const handleQtyPrint = (e:any) => {
    setDataSourcePrint({ITEM_CODE: grade?.ITEM_CODE, QTY: e});
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const gradeDataSearch = Gradedata?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setGradeSearch(gradeDataSearch);
    } else {
      setGradeSearch(Gradedata?.data.data || []);
    }
  };

  useEffect(() => {
    setGradeSearch(Gradedata?.data.data || []);
  }, [isFetching]);

  useEffect(() => {
    if (createStatus === "success") {
      message.success("Add Material Success");
      handleCancel();
    } else if (createStatus === "error") {
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [createStatus]);

  useEffect(() => {
    if (updateStatus === "success") {
      message.success("Update Material Success");
      handleCancel();
    } else if (updateStatus === "error") {
      message.error(
        updateError?.response?.data?.message || updateError.message
      );
    }
  }, [updateStatus]);

  useEffect(() => {
    if (deleteStatus === "success") {
      message.success("Delete Material Success");
    } else if (deleteStatus === "error") {
      message.error(
        deleteError?.response?.data?.message || deleteError.message
      );
    }
  }, [deleteStatus]);

  const menu = (record: any) => (
    <Menu
      onClick={(e) => {
        handleMenu(e, record);
      }}
    >
      <Menu.Item key="1" icon={<EditOutlined />}>
        Detail
      </Menu.Item>
      <Menu.Item key="2" danger icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const handleMenu = (e: any, record: any) => {
    switch (e.key) {
      case "1":
        showModal();
        setGrade({ ...record, event: e.key });

        break;
      case "2":
        Modal.confirm({
          title: "Delete Confirm",
          content: (
            <>{`Do you want delete Material Code : ${record.ITEM_CODE} ?`}</>
          ),
          onOk: () => {
            deleteMutate(record.ITEM_ID);
          },
        });

        break;
    }
  };

  useEffect(() => {
    formGrade.resetFields();
    formGrade.setFieldsValue({
      Grade_Index: grade?.ITEM_ID || null,
      Grade_Id: grade?.ITEM_CODE || "",
      Grade_Description: grade?.ITEM_DESCRIPTION || "",
      Product_Type: String(grade?.Product_ID),
      Grade_Unit: grade?.Unit || "",
      Grade_Status: String(grade?.Status || "0"),
      Min_Qty: grade?.MinQTY || 0,
      Max_Qty: grade?.MaxQTY || 0,
    });

    if(grade?.Product_ID == '3'){
      setHiddenPrint(false); 
      formPrint.setFieldsValue({
        Num_Print: 1,
      });
      setDataSourcePrint({ITEM_CODE: grade?.ITEM_CODE, QTY: 1});
    }else{
      setHiddenPrint(true);
    }
    
    
  }, [grade]);

  const columns = [
    {
      title: "",
      key: "Action",
      className: "w-10",
      render: (text: any, record: any, index: any) => {
        return (
          <Dropdown trigger={["click"]} overlay={menu(record)}>
            <Button>
              Action <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
    {
      title: "Material Code",
      dataIndex: "ITEM_CODE",
      key: "ITEM_CODE",
      align: "center",
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },
    {
      title: "Description",
      dataIndex: "ITEM_DESCRIPTION",
      key: "ITEM_DESCRIPTION",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        a.ITEM_DESCRIPTION.localeCompare(b.ITEM_DESCRIPTION),
    },
    {
      title: "Product Type",
      dataIndex: "Product_DESCRIPTION",
      key: "Product_DESCRIPTION",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Product_DESCRIPTION.localeCompare(b.Product_DESCRIPTION),
    },
    {
      title: "Unit",
      dataIndex: "Unit",
      key: "Unit",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Unit.localeCompare(b.Unit),
    },

    {
      title: "Active",
      dataIndex: "Status",
      key: "Status",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Status - b.Status,
      render: (text: any, record: any, index: any) => {
        return (
          <Tag color={text == "1" ? "success" : "error"}>
            {text == "1" ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Create By",
      dataIndex: "Create_By",
      key: "Create_By",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Create_By.localeCompare(b.Create_By),
    },
    {
      title: "Create Date",
      dataIndex: "Add_Date",
      key: "Add_Date",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        moment(a.Add_Date).unix() - moment(b.Add_Date).unix(),
    },
  ];

  return (
    <>
      <Space className="w-[100%]" direction="vertical">
        <Row>
          <Col flex={1}>
            <Button
              type="primary"
              className="btn-success"
              icon={<PlusOutlined className="relative bottom-[0.2em]" />}
              onClick={showModal}
            >
              Add
            </Button>
          </Col>
          <Col className="flex justify-end items-center" flex={1}>
            <Input
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              placeholder="Search"
              onChange={(e) => handleSearch(e)}
            />
          </Col>
        </Row>

        <Table
          rowKey={(record: any) => record.ITEM_ID}
          rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
          bordered
          size="small"
          loading={isLoading}
          columns={columns as any}
          dataSource={gradeSearch}
          pagination={{ pageSize: 50 }}
          // scroll={{ y: 800 }}
        />
      </Space>

      <Modal
        visible={visible}
        title="Material"
        onOk={formGrade.submit}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={formGrade.submit}
            icon={<SaveOutlined className="relative bottom-[0.2em]" />}
          >
            Submit
          </Button>,
          <Button
            key="back"
            type="ghost"
            danger
            onClick={handleCancel}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={formGrade}
          name="formGrade"
          onFinish={handleOk}
        >
          <Form.Item name="Grade_Index" label="Grade Index" hidden>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Grade_Id"
                label="Material Code"
                rules={[{ required: true, message: "Please enter Material" }]}
              >
                <Input placeholder="Please enter Material" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="Product_Type"
                label="Product Type"
                rules={[
                  { required: true, message: "Please choose Product Type" },
                ]}
              >
                <Select placeholder="Please choose Product Type" allowClear>
                  <Option value="1">FG</Option>
                  <Option value="2">Part</Option>
                  <Option value="3">Miscellaneous</Option>
                  <Option value="4">Semi Product</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="Grade_Description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter Description" },
                ]}
              >
                <Input placeholder="Please enter Description" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Min_Qty"
                label="Min"
                rules={[{ required: true, message: "Please enter Min" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                  placeholder="Please enter Min"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="Max_Qty"
                label="Max"
                rules={[{ required: true, message: "Please enter Max" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={1000000}
                  placeholder="Please enter Max"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="Grade_Unit" label="Unit">
                <Select allowClear>
                  <Option value="PC">PC</Option>
                  <Option value="SET">SET</Option>
                  <Option value="UT">UT</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="Grade_Status" label="Status">
                <Select>
                  <Option value="0">Inactive</Option>
                  <Option value="1">Active</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
        </Form>
        <Form
          layout="vertical"
          form={formPrint}
          name="formPrint"
          hidden={hiddenPrint}
        >
        <Row gutter={16}>
        <Col span={7}>
              <Form.Item
                name="Num_Print"
                label="Number of Print"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={1000000}
                  placeholder="Number of Print"
                  onChange={(e) => handleQtyPrint(e)}
                />
              </Form.Item>
            </Col>
          <Col span={2}>
                  <Form.Item 
                    name="Num_Prin1t"
                    label=" ">
                    <Button
                      type="primary"
                      className="btn-info"
                      onClick={() => {
                        localStorage.setItem("qr", JSON.stringify(dataSourcePrint));

                        window.open(
                          `${
                            process.env.REACT_APP_PUBLIC_URL
                          }${"/QrCodePrintMisc"}`
                        );
                      }}
                      // onClick={showModalPrint}
                    >
                      <PrinterOutlined />
                      Print
                    </Button>
                  </Form.Item>
                </Col>
            </Row>
          </Form>
      </Modal>

      {/* <Modal
        title="Title"
        visible={visiblePrint}
        onOk={handleOk}
        onCancel={handleCancelPrint}
      >
        
      </Modal> */}
    </>
  );
};

export default Grade;
