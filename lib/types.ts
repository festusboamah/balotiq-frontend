export type EngageOrganiserResponse = {
  id: string;
  organization_id: string;
  display_name: string;
  status: string;
  platform_fee_rate: string | null;
  agreement_accepted_at: string | null;
  agreement_version: string | null;
  created_at: string;
};
export type EngageEventResponse = { id: string; organiser_id: string; organization_id: string; name: string; slug: string; cover_image_url: string | null; code_prefix: string | null; ussd_code: string | null; open_vote_rate: string | null; status: string; leaderboard_mode: string; countdown_visible: boolean; timezone: string; opens_at: string | null; closes_at: string | null; nominations_open_at: string | null; nominations_close_at: string | null; current_configuration_version_id: string | null; created_at: string; certified_at: string | null; certified_by: string | null; result_hash: string | null; payout_requested_at: string | null; payout_requested_by: string | null };
export type EngagePublicEventListItem = { id: string; name: string; slug: string; cover_image_url: string | null; status: string; closes_at: string | null; organiser_name: string };
export type EngagePublicEventResponse = { id: string; name: string; slug: string; cover_image_url: string | null; status: string; timezone: string; opens_at: string | null; closes_at: string | null; nominations_open_at: string | null; nominations_close_at: string | null; leaderboard_mode: string; countdown_visible: boolean; open_vote_rate: string | null };
export type EngagePublicCategoryResponse = { id: string; name: string; slug: string; display_order: number };
export type EngagePublicContestantResponse = { id: string; category_id: string; public_code: string; name: string; bio: string | null; photo_url: string | null; status: string; display_order: number };
export type EngagePublicVotePackageResponse = { id: string; name: string; amount: string; currency: string; vote_quantity: number };
export type EngageVoteIntentResponse = { transaction_id: string; reference: string; event_id: string; contestant_id: string; amount: string; currency: string; vote_quantity: number; payment_status: string; authorization_url: string | null };
export type EngagePaymentStatusResponse = { reference: string; status: string; vote_quantity: number; credited_at: string | null; reconciliation_required: boolean; event_name: string; contestant_name: string; amount: string; currency: string };

export type TicketingOrganiserResponse = EngageOrganiserResponse;

export type EngageConfigurationVersionResponse = { id: string; event_id: string; version_number: number; status: string; approved_at: string | null };
export type EngageCategoryResponse = { id: string; event_id: string; name: string; slug: string; status: string; display_order: number };
export type EngageContestantResponse = { id: string; event_id: string; category_id: string; public_code: string; name: string; bio: string | null; photo_url: string | null; contact_email: string | null; contact_phone: string | null; status: string; display_order: number };
export type EngageVotePackageResponse = { id: string; event_id: string; name: string; amount: string; currency: string; vote_quantity: number; status: string };

export type TicketingEventResponse = { id: string; organiser_id: string; organization_id: string; name: string; slug: string; description: string | null; venue: string | null; cover_image_url: string | null; currency: string; status: string; timezone: string; event_starts_at: string | null; event_ends_at: string | null; created_at: string };
export type TicketingTierResponse = { id: string; event_id: string; name: string; description: string | null; amount: string; currency: string; capacity: number | null; status: string; sort_order: number };
export type TicketingPublicEventResponse = { id: string; name: string; slug: string; description: string | null; venue: string | null; cover_image_url: string | null; currency: string; status: string; timezone: string; event_starts_at: string | null; event_ends_at: string | null };
export type TicketingPublicTierResponse = { id: string; name: string; description: string | null; amount: string; currency: string; remaining_capacity: number | null };
export type TicketingOrderResponse = { id: string; event_id: string; tier_id: string; quantity: number; unit_amount: string; total_amount: string; currency: string; status: string; internal_reference: string; authorization_url: string | null };
export type TicketingTicketResponse = { id: string; display_code: string; status: string; qr_data_uri: string | null };
export type TicketingOrderWithTicketsResponse = { order: TicketingOrderResponse; event_name: string; tier_name: string; tickets: TicketingTicketResponse[] };
export type TicketingCheckInResponse = { ticket_id: string; display_code: string; tier_name: string; checked_in_at: string };

export type SuperAdminResponse = { id: string; email: string; created_at: string };
export type AuditEventResponse = { id: string; occurred_at: string; actor_user_id: string | null; organization_id: string | null; action: string; target_type: string; target_id: string | null; correlation_id: string | null; reason: string | null; detail: Record<string, unknown> | null };
export type SessionResponse = { id: string; created_at: string; expires_at: string; is_current: boolean };
export type MfaStatusResponse = { enabled: boolean; backup_codes_remaining: number };
export type MfaEnrollResponse = { secret: string; qr_code_data_uri: string };
export type MfaConfirmResponse = { backup_codes: string[] };

export type EngageSettlementResponse = { id: string; event_id: string; organization_id: string; status: string; platform_fee_rate: string; gross_verified_value: string; excluded_refunded_amount: string; balotiq_fee: string; organiser_net: string; calculated_at: string; calculated_by: string | null; approved_at: string | null };
export type EngageFinancialSummaryResponse = { event_name: string; event_status: string; gross_verified_value: string; excluded_refunded_amount: string; balotiq_fee: string | null; organiser_net: string | null; settlement_status: string; payout_requested_at: string | null; payout_requested_by: string | null };
export type EngageReconciliationPaymentResponse = { id: string; event_id: string; organization_id: string; contestant_id: string; category_id: string; internal_reference: string; amount: string; currency: string; vote_quantity: number; status: string; reconciliation_reason: string | null; provider_verified_at: string | null; created_at: string; reconciled_by: string | null; reconciled_at: string | null };
export type EngageIntegrityCaseResponse = { id: string; event_id: string; contestant_id: string | null; organization_id: string; status: string; severity: string; trigger: string; summary: string; opened_by: string | null; opened_at: string; closed_by: string | null; closed_at: string | null; outcome: string | null; created_at: string };
export type EngageCaseNoteResponse = { id: string; case_id: string; author_id: string | null; note: string; created_at: string };
export type EngageSupportCaseResponse = { id: string; event_id: string; transaction_id: string | null; organization_id: string; requester_contact: string; requester_type: string; category: string; priority: string; summary: string; status: string; owner_id: string | null; opened_by: string | null; opened_at: string; resolved_by: string | null; resolved_at: string | null; resolution_note: string | null; created_at: string };

export type DataSubjectRequestResponse = { id: string; user_id: string | null; requester_email: string; request_type: string; status: string; details: string; due_at: string; handled_by: string | null; resolved_at: string | null; resolution_note: string | null; created_at: string };

export type SitePageResponse = { slug: string; title: string; body: string; updated_at: string };
export type SiteImageResponse = { slug: string; image_url: string; alt_text: string; updated_at: string };

export type EngageNominationResponse = { id: string; event_id: string; category_id: string; nominee_name: string; nominee_reason: string | null; photo_url: string | null; nominee_contact_email: string | null; nominee_contact_phone: string | null; submitter_name: string; submitter_email: string; submitter_phone: string | null; status: string; rejection_reason: string | null; reviewed_by: string | null; reviewed_at: string | null; resulting_contestant_id: string | null; created_at: string };
export type EngagePublicNominationReceiptResponse = { id: string };
export type EngageSearchHitResponse = { type: string; id: string; label: string; event_id: string | null };
export type TicketingSalesSummaryResponse = { gross_sales: string; currency: string; tickets_issued: number; tickets_checked_in: number };

export type OrganizationResponse = {
  id: string; name: string; slug: string; billing_mode: string;
  flat_fee_amount_override: string | null; status: string;
};

export type MembershipResponse = { id: string; user_id: string; email: string; role: string };

export type ElectionResponse = {
  id: string; organization_id: string; title: string; description: string | null;
  voting_mode: string; status: string; start_at: string; end_at: string;
  results_visible_override: boolean | null; nominations_open_at: string | null;
  nominations_close_at: string | null; created_at: string;
  quorum_threshold_percent: string | null; certified_at: string | null; certified_by: string | null;
};

export type CandidateResponse = { id: string; position_id: string; name: string; bio: string | null; photo_url: string | null; display_order: number; status: string };
export type PositionWithCandidatesResponse = {
  id: string; election_id: string; title: string; display_order: number;
  position_type: "STANDARD" | "MOTION"; approval_threshold_percent: string | null;
  selection_min: number; selection_max: number; candidates: CandidateResponse[];
};
export type VoterRollEntryResponse = { id: string; election_id: string; external_voter_id: string; email: string | null; phone: string | null };
export type VoterRollImportResponse = { imported_count: number; duplicate_count: number; error_count: number; errors: { row_number: number; message: string }[] };
export type SendVoterInvitationsResponse = { invited_count: number; email_count: number; sms_count: number; skipped_count: number };
export type BallotViewResponse = { election_id: string; end_at: string; has_voted: boolean; positions: PositionWithCandidatesResponse[] };
export type CastBallotResponse = { receipts: string[]; submitted_at: string };
export type ElectionResultResponse = { position_id: string; candidate_id: string; vote_count: number };
export type MotionOutcomeResponse = { position_id: string; yes_count: number; no_count: number; approval_threshold_percent: string; outcome: "PASSED" | "FAILED" };
export type ElectionResultsResponse = { candidates: ElectionResultResponse[]; motions: MotionOutcomeResponse[] };
export type TurnoutResponse = { eligible_count: number; voted_count: number };
export type InvoiceResponse = { status: "PENDING" | "PAID" | "FAILED"; amount: string; currency: string };
