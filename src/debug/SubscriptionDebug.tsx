import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

// Helper funkce pro Superwall operace
export async function swRestoreAndSync() {
  try {
    const { Superwall } = await import('react-native-superwall') as any;
    
    console.log('[SUBDBG] Starting Superwall restore+sync...');
    
    if (Superwall.restorePurchases) {
      await Superwall.restorePurchases();
      console.log('[SUBDBG] restorePurchases completed');
    }
    
    if (Superwall.syncPurchases) {
      await Superwall.syncPurchases();
      console.log('[SUBDBG] syncPurchases completed');
    }
    
    return '[SW] restore+sync OK';
  } catch (e) {
    const errorMsg = `[SW] restore+sync ERR: ${String(e)}`;
    console.error('[SUBDBG]', errorMsg);
    return errorMsg;
  }
}

export async function swGetStatus() {
  try {
    const { Superwall } = await import('react-native-superwall') as any;
    
    console.log('[SUBDBG] Getting Superwall status...');
    
    let status = 'unknown';
    let attrs = {};
    
    if (Superwall.getSubscriptionStatus) {
      status = await Superwall.getSubscriptionStatus();
    }
    
    if (Superwall.getUserAttributes) {
      attrs = await Superwall.getUserAttributes();
    }
    
    const result = `[SW] status=${status} attrs=${JSON.stringify(attrs)}`;
    console.log('[SUBDBG]', result);
    return result;
  } catch (e) {
    const errorMsg = `[SW] getStatus ERR: ${String(e)}`;
    console.error('[SUBDBG]', errorMsg);
    return errorMsg;
  }
}

// Volitelný StoreKit check přes react-native-iap
export async function iapCheckOptional() {
  try {
    console.log('[SUBDBG] Attempting react-native-iap import...');
    const RNIap = await import('react-native-iap') as any;
    
    console.log('[SUBDBG] Initializing IAP connection...');
    await RNIap.initConnection();
    
    console.log('[SUBDBG] Getting available purchases...');
    const purchases = await RNIap.getAvailablePurchases();
    
    let receipt = null;
    let receiptLen = 0;
    
    if (RNIap.getReceiptIOS) {
      console.log('[SUBDBG] Getting iOS receipt...');
      receipt = await RNIap.getReceiptIOS();
      receiptLen = receipt?.length || 0;
    }
    
    console.log('[SUBDBG] Ending IAP connection...');
    await RNIap.endConnection();
    
    const purchaseData = purchases.map((p: any) => ({
      pid: p.productId,
      tid: p.transactionId
    }));
    
    const result = `[IAP] purchases=${JSON.stringify(purchaseData)} receiptLen=${receiptLen}`;
    console.log('[SUBDBG]', result);
    return result;
  } catch (e) {
    const errorStr = String(e);
    // Check if it's a module-not-found error
    if (errorStr.includes('Unable to resolve module') || errorStr.includes('Cannot resolve module') || errorStr.includes('Module not found')) {
      const errorMsg = `RNIap not installed – skipped`;
      console.log('[SUBDBG]', errorMsg);
      return errorMsg;
    }
    const errorMsg = `[IAP] skipped or error: ${errorStr}`;
    console.log('[SUBDBG]', errorMsg);
    return errorMsg;
  }
}

const SubscriptionDebug: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[SUBDBG] ${timestamp} ${message}`;
    
    console.log('[SUBDBG]', logEntry);
    
    setLogs(prev => {
      const newLogs = [...prev, logEntry];
      // Zachovej posledních ~200 řádků
      return newLogs.slice(-200);
    });

    // Auto-scroll na konec
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleRestoreSync = async () => {
    addLog('🔄 Starting Restore & Sync (Superwall)...');
    try {
      const result = await swRestoreAndSync();
      addLog(`✅ ${result}`);
    } catch (e) {
      addLog(`❌ Restore & Sync failed: ${String(e)}`);
    }
  };

  const handleCheckStatus = async () => {
    addLog('📊 Checking Superwall Status...');
    try {
      const result = await swGetStatus();
      addLog(`📈 ${result}`);
    } catch (e) {
      addLog(`❌ Status check failed: ${String(e)}`);
    }
  };

  const handleCheckStoreKit = async () => {
    addLog('🛒 Checking StoreKit (optional)...');
    try {
      const result = await iapCheckOptional();
      addLog(`🍎 ${result}`);
    } catch (e) {
      addLog(`❌ StoreKit check failed: ${String(e)}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('🗑️ Logs cleared');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐛 Subscription Debug</Text>
        <Text style={styles.subtitle}>Non-invasive subscription state checker</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleRestoreSync}
        >
          <Text style={styles.buttonText}>🔄 Restore & Sync (Superwall)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleCheckStatus}
        >
          <Text style={styles.buttonText}>📊 Check Superwall Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.tertiaryButton]}
          onPress={handleCheckStoreKit}
        >
          <Text style={styles.buttonText}>🛒 Check StoreKit (Optional)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearLogs}
        >
          <Text style={styles.buttonText}>🗑️ Clear Logs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.logHeader}>📝 Debug Logs (last ~200 lines)</Text>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
        >
          {logs.length === 0 ? (
            <Text style={styles.emptyLog}>No logs yet. Press a button to start debugging.</Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={styles.logEntry}>
                {log}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  tertiaryButton: {
    backgroundColor: '#FF9500',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    padding: 8,
  },
  emptyLog: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  logEntry: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});

export default SubscriptionDebug;