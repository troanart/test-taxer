import React, { useState } from "react";
import ASN1 from "@lapo/asn1js";
import Hex from "@lapo/asn1js/hex";

interface Certificate {
  id: number;
  commonName: string;
  validityPeriod: string;
  issuerName: string;
}

const parseCertificate = (certData: ArrayBuffer): Certificate | null => {
  const result = ASN1.decode(certData);
  if (result.typeName() !== "SEQUENCE") {
    throw "Неправильна структура конверта сертифіката (очікується SEQUENCE)";
  }
  const tbsCertificate = result.sub[0];

  // Проверяем, что tbsCertificate и его необходимые свойства существуют
  if (!tbsCertificate || !tbsCertificate.sub) {
    return null;
  }

  // Производим дальнейший парсинг сертификата и возвращаем объект Certificate
  const commonName = ""; // Получаем commonName из сертификата
  const validityPeriod = ""; // Получаем validityPeriod из сертификата
  const issuerName = ""; // Получаем issuerName из сертификата

  const certificate: Certificate = {
    id: Date.now(),
    commonName: commonName,
    validityPeriod: validityPeriod,
    issuerName: issuerName,
  };

  return certificate;
};

const CertificateList: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [dragging, setDragging] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const certificate = parseCertificate(file); // Парсим сертификат
      setCertificates((prevCertificates: Certificate[]) => [
        ...prevCertificates,
        certificate,
      ]); // Добавляем сертификат в список
    }
    setDragging(false);
  };

  const renderCertificateList = () => {
    return certificates.map((certificate) => (
      <div key={certificate.id}>
        <p>{certificate.commonName}</p>
        <p>{certificate.validityPeriod}</p>
        <p>{certificate.issuerName}</p>
      </div>
    ));
  };

  return (
    <div>
      <h2>Список Сертифікатів</h2>
      <div
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e)}
        style={{
          border: dragging ? "2px dashed #000" : "none",
          padding: "20px",
          cursor: "pointer",
        }}
        onMouseEnter={() => setDragging(true)}
        onMouseLeave={() => setDragging(false)}>
        Перетягніть ваш сертифікат сюди
      </div>
      {renderCertificateList()}
    </div>
  );
};

export default CertificateList;
