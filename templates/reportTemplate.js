export function reportTemplate(dto) {
  return `
      <html>
        <head>
          <style>
            @page {
              margin: 16px;
              border: 1px solid #000;
            }

            body {
              margin: 0;
              font-family: Arial, sans-serif;
              font-size: 12px;
            }

            p {
              margin: 0;
              padding: 0;
              font-size: 12px;
            }

            .report-table {
              width: 100%;
              border-collapse: collapse;
            }

            .header-wrapper {
              height: 100px;
              border-bottom: 2px solid #000;
            }

            .header-table {
              width: 100%;
              height: 100%;
              border-collapse: collapse;
            }

            .header-logo {
              width: 15%;
              text-align: center;
              vertical-align: middle;
              border-right: 1px solid #000;
            }

            .header-title {
              width: 85%;
              text-align: center;
              vertical-align: middle;
              font-weight: bold;
            }

            .ident-table {
              width: 100%;
              border-collapse: collapse;
            }

            .ident-row {
              height: 50px;
            }

            .ident-index {
              width: 10%;
              text-align: center;
              vertical-align: middle;
              border: 1px solid #000;
            }

            .ident-company {
              width: 70%;
              text-align: left;
              vertical-align: middle;
              border: 1px solid #000;
              padding: 4px;
              font-weight: bold;
            }

            .ident-os {
              width: 20%;
              text-align: center;
              vertical-align: middle;
              border: 1px solid #000;
            }

            .equip-table {
              width: 100%;
              border-collapse: collapse;
            }

            .equip-row {
              padding: 6px 4px;
            }

            .equip-cell {
              width: 50%;
              text-align: left;
              vertical-align: middle;
              border: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .equip-cell-2 {
              width: 33.33%;
              text-align: left;
              vertical-align: middle;
              border: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .section-title {
              background-color:rgb(12, 33, 104);
              color: #fff;
              font-size: 12px;
              font-weight: bold;
              text-align: center;
              padding: 6px;
            }

            .considerations-table {
              width: 100%;
              border-collapse: collapse;
            }

            .considerations-row {
              padding: 6px 4px;
            }

            .considerations-cell {
              width: 50%;
              text-align: left;
              vertical-align: middle;
              border: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .maintenance-table {
              width: 100%;
              border-collapse: collapse;
            }

            .maintenance-row {
              padding: 6px 4px;
            }

            .maintenance-cell {
              width: 100%;
              text-align: left;
              vertical-align: middle;
              border: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .required-table {
              width: 100%;
              border-collapse: collapse;
            }

            .required-row {
              padding: 6px 4px;
            }

            .required-cell {
              width: 100%;
              text-align: left;
              vertical-align: middle;
              border: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }
            
            .required-cell-2 {
              width: 55%;
              text-align: left;
              vertical-align: middle;
              border-left: 1px solid #000;
              border-right: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .required-cell-2-border-bottom {
              border-bottom: 1px solid #000;
            }
            
            .required-cell-3 {
              width: 15%;
              text-align: center;
              vertical-align: middle;
              border-right: 1px solid #000;
              border-left: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .compressed-air-generation-room-table {
              width: 100%;
              border-collapse: collapse;
            }

            .compressed-air-generation-room-row {
              padding: 6px 4px;
            }

            .compressed-air-generation-room-cell {
              width: 80%;
              text-align: left;
              vertical-align: middle;
              border: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .compressed-air-generation-room-cell-2 {
              width: 20%;
              text-align: center;
              vertical-align: middle;
              border: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .compressed-air-generation-room-cell-3 {
              width: 100%;
              text-align: left;
              vertical-align: middle;
              border-left: 1px solid #000;
              border-right: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .compressed-air-generation-room-cell-4 {
              width: 100%;
              text-align: left;
              vertical-align: middle;
              border-left: 1px solid #000;
              border-right: 1px solid #000;
              border-bottom: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }
            
            .closure-information-table {
              width: 100%;
              border-collapse: collapse;
            }

            .closure-information-row {
              padding: 6px 4px;
            }
            
            .closure-information-cell {
              width: 50%;
              text-align: left;
              vertical-align: middle;
              border: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .closure-information-cell-2 {
              width: 100%;
              text-align: left;
              vertical-align: middle;
              border-bottom: 1px solid #000;
              border-left: 1px solid #000;
              border-right: 1px solid #000;
              padding: 6px 4px;
              font-size: 12px;
            }

            .signature {
              text-align: center;
              vertical-align: middle;
              font-size: 12px;
              font-weight: bold;
              padding: 16px;
              page-break-inside: avoid;
              break-inside: avoid;
              margin-top: 72px;
            }

            .line-signature {
              border-top: 1px solid #000;
              width: 34%;
              padding-bottom: 8px;
              margin: 0 auto;
            }
            
            /* Attachments (Anexos) */
            .attachments-section {
              page-break-before: always; /* iniciar anexos em folha separada */
              /* break-before: page;  suporte moderno, mantemos page-break para compatibilidade */
            }
            .attachments-list {
              display: flex;
              flex-wrap: wrap;
              text-align: left;
            }
            .attachment-item {
              width: 50%;
              box-sizing: border-box;
              border: 1px solid #ddd;
              padding: 6px;
              margin: 0;
              page-break-inside: avoid;
            }
            .attachment-item img {
              width: 100%;
              height: auto;
              max-height: 220px;
              object-fit: contain;
              display: block;
            }
            
            .topics {
              margin: 6px 0 0 0;
              padding-left: 18px;
            }
            .topics li {
              margin: 4px 0;
            }
          </style>
        </head>

        <body>
          <table class="report-table">
            <thead>
              <tr>
                <td colspan="3" class="header-wrapper">
                  <table class="header-table">
                    <tr>
                      <td class="header-logo">
                        <img src="${dto?.logo ?? ''}" width="80px" height="50px" />
                      </td>
                      <td class="header-title">
                        <p style="font-size: 18px;">CHECK LIST DE ATENDIMENTO CORRETIVO, PREVENTIVO.</p>
                        <p style="font-size: 18px;">PARTIDA TÉCNICA E AVALIAÇÃO.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </thead>

            <tbody>
              <table class="ident-table">
                <tr class="ident-row">
                  <td class="ident-index">1</td>
                  <td class="ident-company">Empresa: ${dto?.company?.name ?? 'N/A'}</td>
                  <td class="ident-os">O.S.: ${dto?.OS_number ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="equip-table">
                <tr class="equip-row">
                  <td class="equip-cell">Equipamento: ${dto?.equipament?.name ?? 'N/A'}</td>
                  <td class="equip-cell">Horímetro atual: ${dto?.equipament?.current_hour_meter ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="equip-table">
                <tr class="equip-row">
                  <td class="equip-cell">Data de fabricação: ${dto?.equipament?.manufacture_date || 'N/A'}</td>
                  <td class="equip-cell">Número de série: ${dto?.equipament?.serial_number ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="equip-table">
                <tr class="equip-row">
                  <td class="equip-cell">Modelo da unidade compressora: ${dto?.equipament?.compressor_unit_model ?? 'N/A'}</td>
                  <td class="equip-cell">Marca e Modelo do Inversor/Soft: ${dto?.equipament?.inverter_softstarter_brand_model ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="equip-table">
                <tr class="equip-row">
                  <td class="equip-cell">Modelo de IHM: ${dto?.equipament?.ihm_model ?? 'N/A'}</td>
                  <td class="equip-cell">Pressão de trabalho: ${dto?.equipament?.working_pressure ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="equip-table">
                <tr class="equip-row">
                  <td class="equip-cell">Modelo do filtro de coalescente: ${dto?.equipament?.coalescing_filter_model ?? 'N/A'}</td>
                  <td class="equip-cell">Dados de lubrificação do motor: ${dto?.equipament?.motor_lubrication_data ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="equip-table">
                <tr class="equip-row">
                  <td class="equip-cell-2">Tensão de alimentação: ${dto?.equipament?.supply_voltage ?? 'N/A'}</td>
                  <td class="equip-cell-2">Tensão de comando: ${dto?.equipament?.control_voltage ?? 'N/A'}</td>
                  <td class="equip-cell-2">Tensão da solenóide de admissão: ${dto?.equipament?.intake_solenoid_voltage ?? 'N/A'}</td>
                </tr>
              </table>

              <div class="section-title">
                CONSIDERAÇÕES GERAIS DO ATENDIMENTO
              </div>

              <table class="considerations-table">
                <tr class="considerations-row">
                  <td class="considerations-cell">Motivo da visita: ${dto?.cga_reason_visit != null ? '<br /> ' : ''} ${dto?.cga_reason_visit ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="considerations-table">
                <tr class="considerations-row">
                  <td class="considerations-cell">Defeito/Situação encontrada: ${dto?.cga_reported_defect != null ? '<br /> ' : ''} ${dto?.cga_reported_defect ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="considerations-table">
                <tr class="considerations-row">
                  <td class="considerations-cell">Serviço realizado: ${dto?.cga_solution_applied != null ? '<br /> ' : ''} ${dto?.cga_solution_applied ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="considerations-table">
                <tr class="considerations-row">
                  <td class="considerations-cell">Peças substituídas nesta visita: ${dto?.cga_replaced_parts != null ? '<br /> ' : ''} ${dto?.cga_replaced_parts ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="considerations-table">
                <tr class="considerations-row">
                  <td class="considerations-cell">Peças que necessitam de substituição: ${dto?.cga_parts_to_replace != null ? '<br /> ' : ''} ${dto?.cga_parts_to_replace ?? 'N/A'}</td>
                </tr>
              </table>

              <div class="section-title">
                PLANOS DE MANUTENÇÃO
              </div>

              <table class="maintenance-table">
                <tr class="maintenance-row">
                  <td class="maintenance-cell">Óleo: ${dto?.mp_oil ?? 'N/A'}</td>
                </tr>
                <tr class="maintenance-row">  
                  <td class="maintenance-cell">Elemento separador de Ar/Óleo: ${dto?.mp_air_oil_separator_element ?? 'N/A'}</td>
                </tr>
                <tr class="maintenance-row">
                  <td class="maintenance-cell">Filtro de ar primário: ${dto?.mp_primary_air_filter ?? 'N/A'}</td>
                </tr>
                <tr class="maintenance-row">
                  <td class="maintenance-cell">Filtro de ar secundário: ${dto?.mp_secondary_air_filter ?? 'N/A'}</td>
                </tr>
                </tr>
                <tr class="maintenance-row">
                  <td class="maintenance-cell">Filtro de ar Standard: ${dto?.mp_standard_air_filter ?? 'N/A'}</td>
                </tr>
                <tr class="maintenance-row">
                  <td class="maintenance-cell">Filtro de óleo: ${dto?.mp_oil_filter ?? 'N/A'}</td>
                </tr>
                <tr class="maintenance-row">
                  <td class="maintenance-cell">Lubrificante do motor: ${dto?.mp_engine_lubricant ?? 'N/A'}</td>
                </tr>
                <tr class="maintenance-row">
                  <td class="maintenance-cell">Elemento coalescente: ${dto?.mp_coalescing_element ?? 'N/A'}</td>
                </tr>
                <tr class="maintenance-row">
                  <td class="maintenance-cell">Revisão do elemento do compressor: ${dto?.mp_compressor_element_revision ?? 'N/A'}</td>
                </tr>
              </table>

              <div class="section-title">
                LEITURAS OBRIGATÓRIAS
              </div>

              <table class="required-table">
                <tr class="required-row">
                  <td class="required-cell">Nível de óleo lubrificante: ${dto?.rr_lubricating_oil_level ?? 'N/A'}</td>
                </tr>
                <tr class="required-row">
                  <td class="required-cell">Quantidade de óleo em estoque: ${dto?.rr_oil_stock_quantity ?? 'N/A'}</td>
                </tr>
                <tr class="required-row">
                  <td class="required-cell">Descrição do modelo de óleo: ${dto?.rr_oil_model ?? 'N/A'}</td>
                </tr>
                <tr class="required-row">
                  <td class="required-cell">Tipo de óleo: ${dto?.rr_oil_type ?? 'N/A'}</td>
                </tr>
              </table>
              <table class="required-table">
                <tr class="required-row">
                  <td class="required-cell-2 required-cell-2-border-bottom">Tensão da rede elétrica com carga:</td>
                  <td class="required-cell-3 required-cell-2-border-bottom">R: ${dto?.rr_supply_voltage_under_load_R ?? 'N/A'}</td>
                  <td class="required-cell-3 required-cell-2-border-bottom">S: ${dto?.rr_supply_voltage_under_load_S ?? 'N/A'}</td>
                  <td class="required-cell-3 required-cell-2-border-bottom">T: ${dto?.rr_supply_voltage_under_load_T ?? 'N/A'}</td>
                </tr>
              </table>
              <table class="required-table">
                <tr class="required-row">
                  <td class="required-cell-2">Tensão da rede elétrica em alívio:</td>
                  <td class="required-cell-3">R: ${dto?.rr_supply_voltage_unloaded_R ?? 'N/A'}</td>
                  <td class="required-cell-3">S: ${dto?.rr_supply_voltage_unloaded_S ?? 'N/A'}</td>
                  <td class="required-cell-3">T: ${dto?.rr_supply_voltage_unloaded_T ?? 'N/A'}</td>
                </tr>
              </table>
              <table class="required-table">
                <tr class="required-row">
                  <td class="required-cell">Corrente do motor elétrico com fator de serviço: ${dto?.rr_service_factor_current ?? 'N/A'}</td>
                </tr>
                <tr class="required-row">
                  <td class="required-cell">Corrente elétrica com carga: ${dto?.rr_electrical_current_under_load ?? 'N/A'}</td>
                </tr>
                <tr class="required-row">
                  <td class="required-cell">Corrente elétrica em alívio: ${dto?.rr_electrical_current_unloaded ?? 'N/A'}</td>
                </tr>
                <tr class="required-row">
                  <td class="required-cell">Corrente elétrica do motor do ventilador: ${dto?.rr_fan_motor_current ?? 'N/A'}</td>
                </tr>
                <tr class="required-row">
                  <td class="required-cell">Temperatura de trabalho do compressor: ${dto?.rr_compressor_operating_temperature ?? 'N/A'}</td>
                </tr>
                <tr class="required-row">
                  <td class="required-cell">Corrente elétrica do secador: ${dto?.rr_dryer_current ?? 'N/A'}</td>
                </tr>
                <tr class="required-row">
                  <td class="required-cell">Temperatura do ponto de orvalho: ${dto?.rr_dew_point_temperature ?? 'N/A'}</td>
                </tr>
                <tr class="required-row">
                  <td class="required-cell">Temperatura do ambiente: ${dto?.rr_ambient_temperature ?? 'N/A'}</td>
                </tr>
              </table>

              <div class="section-title">
                SALA DE GERAÇÃO DO AR COMPRIMIDO
              </div>

              <table class="compressed-air-generation-room-table">
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Equipamento possui duto para retirada de ar quente regularizado?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_hot_air_duct_ok ? 'SIM' : 'NÃO'}</td>
                </tr>

                ${dto?.cr_hot_air_duct_ok === true ? (
                  `
                    <tr class="compressed-air-generation-room-row">
                      <td class="compressed-air-generation-room-cell">Duto regularizado?</td>
                      <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_hot_air_duct_regularized ? 'SIM' : 'NÃO'}</td>
                    </tr>
                  `
                ) : ``}
                
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Temperatura e ventilação da sala são adequadas?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_room_temp_vent_ok ? 'SIM' : 'NÃO'}</td>
                </tr>
              </table>

              <table class="compressed-air-generation-room-table">
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell-3">Observações: ${dto?.cr_room_notes ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="compressed-air-generation-room-table">
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Condições do ambiente de instalação do compressor?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_install_env_condition ?? 'N/A'}</td>
                </tr>
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Existe risco de acidente?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_accident_risk ? 'SIM' : 'NÃO'}</td>
                </tr>
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Instalação elétrica está adequada?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_electrical_install_ok ? 'SIM' : 'NÃO'}</td>
                </tr>
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Instalação possui aterramento para sua segurança?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_grounding_ok ? 'SIM' : 'NÃO'}</td>
                </tr>
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Iluminação da sala é adequada?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_room_lighting_ok ? 'SIM' : 'NÃO'}</td>
                </tr>
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Existe tomada de serviço 220V?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_service_outlet_220v ? 'SIM' : 'NÃO'}</td>
                </tr>
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Sala possui ponto de ar com mangueira para limpeza do compressor?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_air_point_for_cleaning ? 'SIM' : 'NÃO'}</td>
                </tr>
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Sala possui ponto de água com torneira para hidrolavadora?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_water_point_available ? 'SIM' : 'NÃO'}</td>
                </tr>
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Compressor atente os distanciamento exigidos para um bom funcionamento?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_distancing_ok ? 'SIM' : 'NÃO'}</td>
                </tr>
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell">Acesso ao compressor é correto e seguro?</td>
                  <td class="compressed-air-generation-room-cell-2"> ${dto?.cr_compressor_ok ? 'SIM' : 'NÃO'}</td>
                </tr>
              </table>

              <table class="compressed-air-generation-room-table">
                <tr class="compressed-air-generation-room-row">
                  <td class="compressed-air-generation-room-cell-4">Sugestões de melhorias: ${dto?.cr_improvement_suggestions ?? 'N/A'}</td>
                </tr>
              </table>

              <div class="section-title">
                INFORMAÇÕES DE ENCERRAMENTO
              </div>

              <table class="closure-information-table">
                <tr class="closure-information-row">
                <td class="closure-information-cell">Data de início: ${dto?.closing_start_time_1 ?? 'N/A'}</td>
                  <td class="closure-information-cell">Hora de início: ${dto?.closing_start_time_2 ?? 'N/A'}</td>
                </tr>
               <tr class="closure-information-row">
                  <td class="closure-information-cell">Data de fim: ${dto?.closing_end_time_1 ?? 'N/A'}</td>
                  <td class="closure-information-cell">Hora de fim: ${dto?.closing_end_time_2 ?? 'N/A'}</td>
                </tr>
              </table>

              <table class="closure-information-table">
                <tr class="closure-information-row">
                  <td class="closure-information-cell-2" >Nome do técnico: ${dto?.closing_technician_responsible ?? 'N/A'}</td>
                </tr>
                <tr class="closure-information-row">
                  <td class="closure-information-cell-2">Nome do responsável: ${dto?.closing_responsible ?? 'N/A'}</td>
                </tr>
              </table>
              
              <div class="signature">
                ${dto?.signature ? `
                  <img src="${dto?.signature}" width="130px" height="90px" style="margin-bottom: 8px;" />
                ` : ``}
                <div class="line-signature"></div>
                Assinatura do responsável:
              </div>
            </tbody>
          </table>

          ${dto?.attachments?.length > 0 ? `
            <div class="attachments-section">
              <div class="section-title">
                Anexos
              </div>
              <div class="attachments-list">
                ${dto?.attachments?.map(attachment => `
                  <div class="attachment-item">
                    <img src="${attachment}" />
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="signature">
              ${dto?.signature ? `
                <img src="${dto?.signature}" width="130px" height="90px" style="margin-bottom: 8px;" />
              ` : ``}
              <div class="line-signature"></div>
              Assinatura do responsável:
            </div>
          ` : ``}
        </body>
      </html>
    `
}