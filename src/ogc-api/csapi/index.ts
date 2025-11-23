/* -------------------------------------------------------------------------- */
/*                     OGC API – Connected Systems Index                      */
/* -------------------------------------------------------------------------- */

export * from './systems.js';
export * from './deployments.js';
export * from './procedures.js';
export * from './samplingFeatures.js';
export * from './properties.js';
export * from './datastreams.js';
export * from './observations.js';
export * from './controlStreams.js';
export * from './commands.js';
export * from './feasibility.js';
export * from './systemEvents.js';
export * from './systemHistory.js';
export * from './helpers.js';
export * from './model.js';

/* -------------------------------------------------------------------------- */
/*                            Client Class Imports                            */
/* -------------------------------------------------------------------------- */

import { SystemsClient } from './systems.js';
import { DeploymentsClient } from './deployments.js';
import { ProceduresClient } from './procedures.js';
import { SamplingFeaturesClient } from './samplingFeatures.js';
import { PropertiesClient } from './properties.js';
import { DatastreamsClient } from './datastreams.js';
import { ObservationsClient } from './observations.js';
import { ControlStreamsClient } from './controlStreams.js';
import { CommandsClient } from './commands.js';
import { FeasibilityClient } from './feasibility.js';
import { SystemEventsClient } from './systemEvents.js';
import { SystemHistoryClient } from './systemHistory.js';

/* -------------------------------------------------------------------------- */
/*                        Connected Systems Client Map                        */
/* -------------------------------------------------------------------------- */

/**
 * Aggregate mapping of all CSAPI client classes.
 * This allows unified imports such as:
 *   const client = new CSAPIClients.SystemsClient(apiRoot);
 */
export const CSAPIClients = {
  SystemsClient,
  DeploymentsClient,
  ProceduresClient,
  SamplingFeaturesClient,
  PropertiesClient,
  DatastreamsClient,
  ObservationsClient,
  ControlStreamsClient,
  CommandsClient,
  FeasibilityClient,
  SystemEventsClient,
  SystemHistoryClient,
};

/* -------------------------------------------------------------------------- */
/*                                End of File                                 */
/* -------------------------------------------------------------------------- */
