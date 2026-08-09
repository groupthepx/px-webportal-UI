import {
  Typography,
  Card,
  Box,
  Button,
  styled,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FC } from "react";
import CountUp from "react-countup";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CoinBalancePackagesDeatilModel } from "@/model/coin_balance_packages";

const CardBorderBottom = styled(Card)(() => `
  border-bottom: transparent 5px solid;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`);


interface Props {
  onClick: () => void; // Optional click handler
  coinBalancePackage: CoinBalancePackagesDeatilModel;
  myCoin: number
}


const ItemExchange: FC<Props> = ({
  coinBalancePackage,
  onClick,
  myCoin,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  return (
    <CardBorderBottom
      sx={{
        textAlign: "center",
        cursor: "pointer",
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
        },
   

      }}
      style={{
        borderBlockColor: `${theme.colors.primary.main}`,

      }}
      onClick={onClick}
    >
      <Box textAlign={"left"} mb={2}>
        <Typography variant="h3" gutterBottom>
          {t('แลกเงิน')}
        </Typography>
      </Box>

      <Box
        sx={{
          border: `2px solid ${theme.palette.primary.main}`,
          padding: "10px",
          borderRadius: "8px",
          display: "inline-block",
          fontWeight: "bold",
          width: "100%",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            background: theme.colors.gradients.primary,
            WebkitBackgroundClip: "text",
            textAlign: "center",
            WebkitTextFillColor: "transparent",
          }}
        >
          <CountUp start={0} end={parseInt(`${coinBalancePackage && coinBalancePackage.balance || 0}`)} duration={3}
            delay={0}
            decimals={0}
            decimal=""
            prefix=""
            suffix=" ฿"
            separator="," />
        </Typography>
      </Box>

      <Box display="flex" alignItems="left" justifyContent="left" mt={2}>
        <Image
          src="/assets/svg/pg/PX_Coin.svg"
          width={24}
          height={24}
          alt="PX Coin"
        />
        <Typography variant="body1" ml={1}>
          {(coinBalancePackage.coin).toLocaleString()} Coin
        </Typography>
      </Box>

    </CardBorderBottom>
  );
};

export default ItemExchange;
