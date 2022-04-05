import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ExternalProvider } from '@ethersproject/providers'
import { BigNumber, Contract, providers, utils } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

import ERC20ABI from '../constants/contracts/IERC20.sol/IERC20.json'
import useConfirmationModal from './useConfirmationModal'

const useApproval = (tokenAddress: string, spenderAddress?: string) => {
  const { open } = useConfirmationModal();
  const { account, ethereum } = useWallet<ExternalProvider>();

  const contract = useMemo(() => {
    if (!ethereum) return;
    const ERC20Interface = new utils.Interface(ERC20ABI.abi);
    return new Contract(tokenAddress, ERC20Interface, new providers.Web3Provider(ethereum).getSigner());
  }, [ethereum, tokenAddress]);

  const [allowance, setAllowance] = useState<BigNumber>();
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handleApprove = useCallback(() => {
    if (!ethereum || !account || !spenderAddress || !contract) return;
    open(async () => {
      try {
        setIsApproving(true);
        const result = await contract.approve(spenderAddress, BigNumber.from(2).pow(256).sub(1));
        await result.wait();
        setIsApproved(true);
        setIsApproving(false);
      } catch (e) {
        console.log(e);
        setIsApproving(false);
      }
    });
  }, [account, contract, ethereum, open, setIsApproved, setIsApproving, spenderAddress]);

  const fetchAllowance = useCallback(async () => {
    if (!contract || !spenderAddress || !account) return;
    setAllowance(await contract.allowance(account, spenderAddress));
  }, [contract, account, spenderAddress]);

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  useEffect(() => {
    if (allowance && allowance.gt(0)) {
      console.log(allowance.toString())
      setIsApproved(true);
    }
  }, [allowance, setIsApproved]);

  return {
    allowance,
    isApproved,
    isApproving,
    onApprove: handleApprove,
  };
};

export default useApproval;
