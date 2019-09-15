declare module "*.json" {
  const baseURL: {
    java: string,
    pocket: string,
    auth: string
  };
  const get: {
    user: {
      realms_accessible: string,
      version_compatible: string,
      get_servers: string,
      pending_invites: string,
      pending_invites_count: string,
      trial_available: string
    },
    server: {
      get: string,
      ip: string,
      backups: string,
      download: string,
      ops: string,
      subscription: string,
      online_players: string
    },
    template: {
      get_templates: string
    }
  };
  const post: {
    user: {
      authenticate: string,
      refresh: string,
      validate: string,
      invalidate: string,
      signout: string
    }
    server: {
      add_user: string,
      op_user: string
    }
  };
  const put: {
    server: {
      set_to_minigame: string,
      close: string,
      open: string
    }
  };
  const del: {
    server: {
      remove_user: string,
      deop_user: string
    }
  }
  const clientToken: string;
}