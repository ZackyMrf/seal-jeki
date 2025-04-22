// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Box, Button, Card, Container, Flex, Grid } from '@radix-ui/themes';

import { CreateAllowlist } from './CreateAllowlist';
import { Allowlist } from './Allowlist';
import { AllAllowlist } from './OwnedAllowlists';
import WalrusUpload from './EncryptAndUpload';
import Feeds from './AllowlistView';

import { CreateService } from './CreateSubscriptionService';
import { Service } from './SubscriptionService';
import { AllServices } from './OwnedSubscriptionServices';
import FeedsToSubscribe from './SubscriptionView';

function LandingPage() {
  return (
    <Grid columns="2" gap="4">
      <Card>
        <Flex direction="column" gap="2" align="center">
          <div style={{ textAlign: 'center' }}>
            <h2>Allowlist Example</h2>
            <p>Access based on allowlists. Only users on the list can decrypt files.</p>
          </div>
          <Link to="/allowlist-example">
            <Button size="3" variant="primary">Try it</Button>
          </Link>
        </Flex>
      </Card>
      <Card>
        <Flex direction="column" gap="2" align="center">
          <div style={{ textAlign: 'center' }}>
            <h2>Subscription Example</h2>
            <p>Access based on subscription NFTs. Valid NFT holders can decrypt files.</p>
          </div>
          <Link to="/subscription-example">
            <Button size="3" variant="primary">Try it</Button>
          </Link>
        </Flex>
      </Card>
    </Grid>
  );
}

function App() {
  const currentAccount = useCurrentAccount();
  const [recipientAllowlist, setRecipientAllowlist] = useState<string>('');
  const [capId, setCapId] = useState<string>('');

  return (
    <BrowserRouter>
      <Container>
        <Flex px="4" py="2" justify="between" align="center">
          <h1 className="text-4xl font-bold">Seal Example Apps</h1>
          <Box>
            <ConnectButton />
          </Box>
        </Flex>

        <Card style={{ marginBottom: '2rem', padding: '1rem' }}>
          <p>1. Code is available <a href="https://github.com/MystenLabs/seal" target="_blank">here</a>.</p>
          <p>2. Testnet only. Get SUI from <a href="https://faucet.sui.io/" target="_blank">faucet</a>.</p>
          <p>3. Files are stored for 1 epoch. Images only.</p>
        </Card>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/allowlist-example" element={<CreateAllowlist />} />
          <Route path="/allowlist-example/admin/allowlist/:id" element={
            currentAccount ? (
              <>
                <Allowlist setRecipientAllowlist={setRecipientAllowlist} setCapId={setCapId} />
                <WalrusUpload
                  policyObject={recipientAllowlist}
                  cap_id={capId}
                  moduleName="allowlist"
                />
              </>
            ) : (
              <Card style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Please connect your wallet to continue</p>
              </Card>
            )
          } />
          <Route path="/allowlist-example/admin/allowlists" element={<AllAllowlist />} />
          <Route path="/allowlist-example/view/allowlist/:id" element={
            currentAccount ? (
              <Feeds suiAddress={currentAccount.address} />
            ) : (
              <Card style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Please connect your wallet to view feeds</p>
              </Card>
            )
          } />

          <Route path="/subscription-example" element={<CreateService />} />
          <Route path="/subscription-example/admin/service/:id" element={
            currentAccount ? (
              <>
                <Service setRecipientAllowlist={setRecipientAllowlist} setCapId={setCapId} />
                <WalrusUpload
                  policyObject={recipientAllowlist}
                  cap_id={capId}
                  moduleName="subscription"
                />
              </>
            ) : (
              <Card style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Please connect your wallet to continue</p>
              </Card>
            )
          } />
          <Route path="/subscription-example/admin/services" element={<AllServices />} />
          <Route path="/subscription-example/view/service/:id" element={
            currentAccount ? (
              <FeedsToSubscribe suiAddress={currentAccount.address} />
            ) : (
              <Card style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Please connect your wallet to view subscriptions</p>
              </Card>
            )
          } />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
