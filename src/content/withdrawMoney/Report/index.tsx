'use client';
import PageHeader from '@/components/PageHeader';
import { useGetMemberByIdQuery, useGetMemberOverviewDetailByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { Box, Button, Card, Container, Fade, Typography, useTheme, } from '@mui/material';
import { format } from "date-fns";
import { FC, use, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetWithdrawListAllQuery } from '@/lib/features/withdraw';
import { decrypt } from '@/utils/encryption';
import wait from '@/utils/wait';
import SuspenseLoader from '@/components/SuspenseLoader';
import { useGetOrganizationListAllQuery } from '@/lib/features/organization';


declare global {
  // tslint:disable-next-line:no-unused-variable
  interface Window {
    Stimulsoft: any;
  }
}

interface Props {
  params: any | null
}

async function getBase64FromUrlToJpeg(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  const imageBitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context is null');


  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw image on top
  ctx.drawImage(imageBitmap, 0, 0);

  return canvas.toDataURL('image/jpeg');
}


const WithdrawMoneyReportPage: FC<Props> = ({
  params
}) => {

  const { id } = useParams();

  const resolvedParams: any = id ? use(params) : null;
  const ParamsId = resolvedParams && resolvedParams.id ? `${decrypt(decodeURIComponent(resolvedParams.id as string))}` : '0';



  const theme = useTheme();
  const router = useRouter();



  const { data: ProfileById, isLoading: isLoadingProfilegById } = useGetProfileByIdQuery(
  );
  const memberParamsId = !isLoadingProfilegById && ProfileById && ProfileById.data && ProfileById.data.member_id ? `${ProfileById.data.member_id}` : '0';
  const { data: overviewDetailById, isLoading: isLoadingOverviewDetailById, refetch: refetchOverviewDetailById } = useGetMemberOverviewDetailByIdQuery(
    { id: `${memberParamsId}`, organizationId: ParamsId },
    { skip: ParamsId === '0' || memberParamsId === '0' }
  );
  const { data: memberById, isLoading: isLoadingMemberById } = useGetMemberByIdQuery(
    { id: `${memberParamsId}` },
    { skip: memberParamsId === '0' }
  );
  const memberDetail = memberById && memberById.data ? memberById.data : null


  const memberId = memberDetail && memberDetail.member_id ? `${memberDetail.member_id}` : '0';

  const { data: organizationListAll,
  } = useGetOrganizationListAllQuery();
  const organizationData = organizationListAll?.data?.filter((item: any) => item.is_active === true)

  const { data: withdrawListAll, isLoading: isLoadingwithdrawListAll,
    error: errorusermemberList
  } = useGetWithdrawListAllQuery({
    status: '',
    date: '',
    created_by_id: memberId,
  },
    { skip: memberId === '0' }
  );



  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/scripts/stimulsoft.viewer.js";
    script.async = true;
    script.onload = () => {
      if (!window.Stimulsoft) {
        console.error("window.Stimulsoft is undefined");
      }
    };
    script.onerror = () => {
      console.error("Failed to load Stimulsoft script");
    };

    document.body.appendChild(script);
  }, []);

  const [isLoading, setLoading] = useState(false);

  const getDataForReport = async (getData: any) => {

    setLoading(true)


    const NewChangeData = await getChangeData(getData);



    // console.log("NewChangeData" , NewChangeData)
    // console.log("new window.Stimulsoft.Viewer" , new window.Stimulsoft.Viewer.StiViewerOptions())

    const optionsOut = new window.Stimulsoft.Viewer.StiViewerOptions();


    optionsOut.toolbar.viewMode = 1;
    optionsOut.toolbar.fontFamily = "timesnewroman"
    optionsOut.toolbar._zoom = 100

    optionsOut.appearance.showTooltips = false;


    optionsOut.toolbar.showPrintButton = false;

    optionsOut.toolbar.showAboutButton = false;
    optionsOut.toolbar.showFindButton = false;

    optionsOut.toolbar.showOpenButton = false;
    optionsOut.appearance.interfaceType = window.Stimulsoft.Viewer.StiInterfaceType.Touch;


    optionsOut.exports.showExportDialog = false;
    optionsOut.exports.showExportToCsv = false;
    optionsOut.exports.showExportToDocument = false;
    optionsOut.exports.showExportToExcel2007 = false;
    optionsOut.exports.showExportToHtml = false;
    optionsOut.exports.showExportToHtml5 = false;
    optionsOut.exports.showExportToWord2007 = false;
    optionsOut.exports.showExportToImageBmp = false;
    optionsOut.exports.showExportToXps = false
    optionsOut.exports.storeExportSettings = false
    optionsOut.exports.showExportToJson = false
    optionsOut.exports.showExportToText = false
    optionsOut.exports.showExportToOpenDocumentWriter = false
    optionsOut.exports.showExportToOpenDocumentCalc = false
    optionsOut.exports.showExportToPowerPoint = false
    optionsOut.exports.showExportToImageSvg = false
    // options.appearance.interfaceType =
    //   window.Stimulsoft.Viewer.StiInterfaceType.Mouse;

    const dataSourceContract = new window.Stimulsoft.System.Data.DataSet();

    const image = await getBase64FromUrlToJpeg('/assets/image/loadding.png')



    dataSourceContract.readJson({
      title: `test`,
      url_image: image,
      nick_name : memberDetail && memberDetail.nick_name ? memberDetail.nick_name : 'N/A',
      user_id: memberDetail && memberDetail.user_px ? memberDetail.user_px : 'N/A',
      data: NewChangeData,

    });

    const viewerContract = new window.Stimulsoft.Viewer.StiViewer(
      optionsOut,
      "StiViewerContract",
      false,
    );
    const reportContract = new window.Stimulsoft.Report.StiReport();


    reportContract.loadFile("/report/history-withdraw.mrt");

    reportContract.regData("root", "root", dataSourceContract);

    viewerContract.report = reportContract;




    viewerContract.renderHtml("viewer");

    //  reportContract.render();


    //  viewerContract.printPreview();



    viewerContract.onBeginExportReport = async function (event: any) {

      switch (event.format) {

        case 'Pdf':

          event.settings.zoom = 2; // Set zoom to 200%
          event.fontFamily = "timesnewroman"
          event.fileName = `ລາຍງານການຂາຍ_${new Date().getTime()}`
        case 'Excel2007':

          event.settings.zoom = 2; // Set zoom to 200%
          event.fontFamily = "timesnewroman"
          event.fileName = `ລາຍງານການຂາຍ_${new Date().getTime()}`




          break;

      }


    }



    await wait(1000);
    // parsedData.mode === 'pdf'



    // console.log("reportContract", reportContract)
    // viewerContract.printedEvent();
    const settings = new window.Stimulsoft.Report.Export.StiPdfExportSettings();
    settings.imageFormat = 2; // PNG for now
    settings.imageResolution = 300;
    settings.imageQuality = 0.8;
    settings.embeddedFonts = true;
    settings.useUnicode = true;
    settings.StandardPdfFonts = false;
    settings.exportRtfTextAsImage = false;
    settings.useDigitalSignature = false;

    const service = new window.Stimulsoft.Report.Export.StiPdfExportService();
    service.pdfFont = "Arial"; // Try Arial first

    const stream = new window.Stimulsoft.System.IO.MemoryStream();


    service.exportTo(reportContract, stream, settings);


    // console.log("service", service)
    const data = stream.toArray();
    const blob = new Blob([new Uint8Array(data)], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const iframe: any = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;

    document.body.appendChild(iframe);

    // Once the iframe is loaded, trigger the print
    iframe.onload = function () {
      iframe.contentWindow.print();
      // document.body.removeChild(iframe);
    };
    // link.href = url;
    // link.download = `ລາຍງານການຂາຍ_${new Date().getTime()}.pdf`;
    // document.body.appendChild(link);
    // // link.print();
    // link.click();
    // PDF a928944b3ec04e412877930bef3f308d [1.4 Stimulsoft Reports / Stimulsoft Report.JS 2019.3.4] (PDF.js: 5.0.44 [e0873f575])




    //   else if (parsedData.mode === 'excel') {
    //     const settings = new window.Stimulsoft.Report.Export.StiExcel2007ExportSettings();

    //     // console.log("settings", settings)



    //     settings.embeddedFonts = true;
    //     settings.exportRtfTextAsImage = true;
    //     settings.useDigitalSignature = true;
    //     settings.useUnicode = true;
    //     settings.StandardPdfFonts = true;

    //     settings.imageResolution = 300; // Try 150 or 300 instead of 500
    //     settings.imageQuality = 0.8; // Try between 0.5 and 0.9
    //     settings.imageFormat = 2;
    //     const service = new window.Stimulsoft.Report.Export.StiExcel2007ExportService();
    //     const stream = new window.Stimulsoft.System.IO.MemoryStream();

    //     service.exportTo(reportContract, stream, settings);

    //     const data = stream.toArray();
    //     const blob = new Blob([new Uint8Array(data)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.download = `ລາຍງານການຂາຍ_${new Date().getTime()}.xlsx`;
    //     link.click();

    //   }
    // } 


    setLoading(false)


  }


  const getChangeData = async (getData: any) => {
    try {
      if (getData.data.length > 0) {
        const eventRequestReport = getData.data.map((data: any, index: number) => {

      // {item.status === 'success' ? <Label color='success'>อนุมัติแล้ว</Label>
      //                               : item.status === 'pending' ? <Label color='warning'>รอดำเนินการ</Label>
      //                                 : item.status === 'wait_payment' ? <Label color='info'>รอชำระเงิน</Label>
      //                                   : item.status === 'reject' ? <Label color='error'>ถูกปฏิเสธ</Label> : ''}

          return {
            ...data,
            company_name : `${organizationData?.find((items: any) => `${items.organization_id}` === `${data?.organization_id}`).company_name || ''}`,
            status : data.status === 'success' ? 'อนุมัติแล้ว'
              : data.status === 'pending' ? 'รอดำเนินการ'
                : data.status === 'wait_payment' ? 'รอชำระเงิน'
                  : data.status === 'reject' ? 'ถูกปฏิเสธ'
                    : '',
            created_at: data.created_at ? `${format(new Date(data.created_at),  "dd/MM/yyyy HH:mm:ss")}` : 'N/A',
           
          };
        });

        return eventRequestReport;
      } else {
        return [];
      }
      // return [];


    } catch (e) {
      console.error(e);
      return [];
    }
  };


  useEffect(() => {

    if (!isLoadingwithdrawListAll && withdrawListAll) {

      getDataForReport(withdrawListAll)
    }

  }, [withdrawListAll]);

  return (

    <>
      <Card sx={{
        px: 3,
        pb: 3
      }} >
        {
          <>
            {(
              <>
                {isLoading ? (
                  <SuspenseLoader />
                ) : " "
                }
                <Box id="viewer" />
              </>
            )
            }
          </>
        }

      </Card>
    </>
  );
}

export default WithdrawMoneyReportPage;
