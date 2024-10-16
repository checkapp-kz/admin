import React from "react";

interface EmailTemplateProps {
  partner_name: string;
  text: string;
  mail: string;
}

export const PartnerMailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ partner_name, text, mail }) => (
  <div>
    <h1>Имя партнера: {partner_name}!</h1>
    <h1>Почта партнера: {mail}!</h1>
    <p>{text}</p>
  </div>
);
