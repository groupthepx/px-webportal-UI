import { FC } from 'react';
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Boxdata from '@/components/Boxdata';
import { format } from "date-fns";
import Label from '@/components/Label';

import { useRouter } from 'next/navigation';

import { RewardHistoryListModel } from '@/model/reward_history';
import { MemberOrganization } from '@/model/member';


interface Props {
  rewardHistoryById: RewardHistoryListModel | null
  errorCouponListAll: any
  organizationParamsId: string
  member_Organization: MemberOrganization[]


}

const CoinManagementTable: FC<Props> = ({
  rewardHistoryById,
  errorCouponListAll,
  organizationParamsId,
  member_Organization


}) => {
  // const isMountedRef = useRefMounted();
  const theme = useTheme();
  const router = useRouter();
  const { t }: { t: any } = useTranslation();





  return (
    <>
      <Card>
        <Box px={3} pb={3}>



          {(
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "transparent",
                      }}
                    >
                      <TableCell align="left" className={'whitespace-nowrap'}  >{t("วันที่")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >{t("เวลา")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >{t("บริษัท")}</TableCell>
                      <TableCell className={'whitespace-nowrap'} align="left">{t('ประเภท')}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >{t("สถานะ")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >{t("ยอดที่ทำได้")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >
                        {t("ภารกิจรับ coin เพี่ม")}
                      </TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >{t("เข็มที่ได้รับ")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >{t("ภารกิจพิชิตเข็ม")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >
                        {t("ภารกิจ VJ Active")}
                      </TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >{t("โบนัสอันดับ")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >
                        {t("เหรียญที่ได้รับจากไฟล์ Excel")}
                      </TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >
                        {t("สะสมภารกิจพิชิตเข็ม")}
                      </TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'}  >
                        {t("สะสมภารกิจพิชิตเข็มที่ได้รับ")}
                      </TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'} >{t("อังเปา")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'} >{t("โบนัสแนะนำเพื่อน")}</TableCell>
                    <TableCell align="left" className={'whitespace-nowrap'} >{t("จำนวนโบนัสเรียน")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'} >{t("โบนัสเรียน")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'} >{t("จำนวนแลกเหรียญ")}</TableCell>
                      <TableCell align="left" className={'whitespace-nowrap'} >{t("แลกเหรียญ")}</TableCell>

                      <TableCell align="left" className={'whitespace-nowrap'}  >
                        <strong style={{ color: theme.colors.success.main }}>{t("รวม Coin ที่ได้รับ")}</strong>
                      </TableCell>

                      {/* <TableCell align="left">{t('จำนวน CoinPX ')}</TableCell>
                      <TableCell align="left">{t('สถานะธุรกรรม')}</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {errorCouponListAll ||
                      (rewardHistoryById &&
                        rewardHistoryById.data.length === 0) ? (
                      <TableRow hover>
                        <TableCell
                          colSpan={15}
                          className="whitespace-nowrap"
                          align="left"
                        >
                          <Typography
                            sx={{
                              py: 10,
                            }}
                            variant="h6"
                            fontWeight="normal"
                            color="text.secondary"
                            align="center"
                          >
                            <Boxdata />
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      rewardHistoryById &&
                      rewardHistoryById.data
                        .filter((item: any) => item.organization_id === organizationParamsId)
                        .map((item: any, index) => {
                          return (
                            <TableRow hover key={index}>
                              <TableCell
                                className="whitespace-nowrap"
                                align="left"
                              >
                                <Typography variant="subtitle1">
                                  {item.created_at
                                    ? `${format(
                                      new Date(item.created_at),
                                      "dd/MM/yyyy"
                                    )}`
                                    : "N/A"}
                                </Typography>
                              </TableCell>
                              <TableCell
                                className="whitespace-nowrap"
                                align="left"
                              >
                                <Typography variant="subtitle1">
                                  {item.created_at
                                    ? `${format(
                                      new Date(item.created_at),
                                      "HH:mm:ss"
                                    )}`
                                    : "N/A"}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {member_Organization && member_Organization.length > 0
                                    ? member_Organization.find(
                                      (org: any) => org.organization_id === item.organization_id
                                    )?.organization.company_name || "ไม่พบข้อมูล"
                                    : "ไม่พบข้อมูล"}{" "}
                                  {/* {item?.created_by?.nick_name}{" "} */}
                                </Typography>
                              </TableCell>
                              <TableCell align="center" className='whitespace-nowrap' >
                                <Typography variant='subtitle1'>
                                  {item.member_reward_type === "Income" ? <Label color='success'>รายรับ</Label>
                                    : item.member_reward_type === 'Expense' ? <Label color='error'>รายจ่าย</Label>
                                      : item.member_reward_type}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                className="whitespace-nowrap"
                              >
                                <Typography variant="subtitle1">
                                  {item.status === "success" ? (
                                    <Label color="success">เสร็จเรียบร้อย</Label>
                                  ) : item.status === "pending" ? (
                                    <Label color="warning">รอรับ</Label>
                                  ) : (
                                    item.status
                                  )}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.amount
                                    ? item.amount.toLocaleString()
                                    : "0"}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.mission_coin_up
                                    ? item.mission_coin_up.toLocaleString()
                                    : "0"}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                <Typography variant="subtitle1">
                                  {item.bonus_mission_detail
                                    ? item.bonus_mission_detail.match(
                                      /Bonus mission (\w+)/
                                    )?.[1] || ""
                                    : ""}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.bonus_mission
                                    ? item.bonus_mission.toLocaleString()
                                    : "0"}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.vj_active
                                    ? item.vj_active.toLocaleString()
                                    : "0"}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.rank_bonus
                                    ? item.rank_bonus.toLocaleString()
                                    : "0"}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.coin_up_from_excel
                                    ? item.coin_up_from_excel.toLocaleString()
                                    : "0"}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.collect_mission
                                    ? item.collect_mission.toLocaleString()
                                    : "0"}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                <Typography variant="subtitle1">
                                  {item.collect_mission_detail
                                    ? item.collect_mission_detail
                                      .replace(/^Collect mission\s+/, "")
                                      .replace(/\s*\+=\s*\d+$/, "")
                                    : ""}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.coupon_amount
                                    ? item.coupon_amount.toLocaleString()
                                    : "0"}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.refer_bonus
                                    ? item.refer_bonus.toLocaleString()
                                    : "0"}{" "}
                                </Typography>
                              </TableCell>

                           <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.learn_amount
                                    ? item.learn_amount.toLocaleString()

                                    : ""}{" "}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.learn_detail
                                    ? item.learn_detail
                                    : ""}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.transfer_coin_balance
                                    ? item.transfer_coin_balance.toLocaleString()
                                    : ""}{" "}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                {" "}
                                <Typography variant="subtitle1">
                                  {" "}
                                  {item.transfer_coin_balance_detail
                                    ? item.transfer_coin_balance_detail
                                    : ""}{" "}
                                </Typography>
                              </TableCell>

                              <TableCell
                                align="left"
                                className="whitespace-nowrap"
                              >
                                <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                                  {(
                                    Number(item.mission_coin_up || 0) +
                                    Number(item.bonus_mission || 0) +
                                    Number(item.vj_active || 0) +
                                    Number(item.rank_bonus || 0) +
                                    Number(item.coin_up_from_excel || 0) +
                                    Number(item.collect_mission || 0) +
                                    Number(item.coupon_amount || 0) +
                                    Number(item.refer_bonus || 0) +
                                    Number(item.transfer_coin_balance || 0)
                                  ).toLocaleString()}
                                </Typography>
                              </TableCell>

                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

            </>
          )}


        </Box>
      </Card>
    </>
  );
}

export default CoinManagementTable;
