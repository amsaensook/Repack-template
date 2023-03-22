import React, { useContext, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectQR } from "../../contexts/slices/qrSlice";
import { Button, Card } from "antd";
import { PrinterOutlined} from "@ant-design/icons";
import QRCode from "react-qr-code";
import "./Grade.css";
import {decode as base64_decode, encode as base64_encode} from 'base-64';

const print_QR_Code = () => {
  window.print();
  window.close();
};
const gridStyle: React.CSSProperties = {
  width: "33.3%",
  textAlign: "center",
  height: "100%",
  paddingTop: "20px",
  paddingLeft: "5px",
  paddingRight: "5px",
  boxShadow: "1px 1px 1px #fff",
};




const QrCodePrint: React.FC<any> = (props) => {

const obj = JSON.parse(localStorage.getItem("qr") || "{}");

let code_json = [];
for (var i = 0; i < obj.QTY; i++) {
  code_json.push({ITEM_CODE: obj.ITEM_CODE });
}

  return (
    <>
      <div className="print-source print-preview ">
        <div className="no-print">
          <Button
            type="primary"
            className="btn-info"
            onClick={print_QR_Code}
            style={{
              marginBottom: 8,
              marginTop: 8,
              marginLeft: 8,
            }}
          >
            <PrinterOutlined />
            Print
          </Button>
        </div>
        {code_json.map((item: any) => {
          const codeNew = [
            { ITEM_CODE: obj.ITEM_CODE
            },
          ];
          const CodeQR = JSON.stringify(codeNew);
          let encoded = base64_encode(CodeQR);
          const url_qr = "https://www.google.com/file_name?info="+encoded;
          // let decoded  = base64_decode(encoded);
          // const url_qr1 = "https://www.google.com/search?q="+decoded;

          return (
            <>
              <Card.Grid style={gridStyle}>
                <div style={{marginTop:-22}}>
                  <div>
                    <text className="labelItem">{item.ITEM_CODE}</text>
                  </div>
                  <div style={{marginLeft:32}}>
                    <QRCode
                        value={url_qr}
                        size={210}
                        style={{ height: "auto", maxWidth: "100%", width: "80%" }}
                        viewBox={`0 0 256 256`}
                      />
                      
                  </div>
                  
                </div>
              </Card.Grid>
              
            </>
          );
        })}

      </div>
    </>
  );
};

export default QrCodePrint;
