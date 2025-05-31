export interface MinecraftServerStatus {
  online: boolean;
  ip: string;
  port: number;
  players?: {
    online: number;
    max: number;
  };
  version?: string;
  motd?: {
    raw: string[];
    clean: string[];
    html: string[];
  };
}

export async function fetchServerStatus(ip: string, port: number = 25565): Promise<MinecraftServerStatus> {
  try {
    const response = await fetch(`https://api.mcsrvstat.us/2/${ip}:${port}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return {
      online: data.online || false,
      ip: data.ip || ip,
      port: data.port || port,
      players: data.players ? {
        online: data.players.online || 0,
        max: data.players.max || 500
      } : undefined,
      version: data.version,
      motd: data.motd
    };
  } catch (error) {
    console.error('Failed to fetch server status:', error);
    throw error;
  }
}

export async function getLeafSMPStatus(): Promise<MinecraftServerStatus> {
  return fetchServerStatus('play.leafsmp.org', 25590);
}
